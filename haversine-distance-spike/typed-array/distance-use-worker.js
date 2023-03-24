import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {performance} from "perf_hooks";
import {Worker} from "worker_threads";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWorker() {
  return new Worker(__dirname + '/distance-worker')
}

const workers = Array.from({length: 4}, () => createWorker());

function waitMs(timeMs) {
  return new Promise(resolve => {
    setTimeout(resolve, timeMs);
  })
}

await waitMs(100);

const startTime = performance.now();

const buf = fs.readFileSync(__dirname + '/data/data-1000000.float64');
const sharedBuffer = new SharedArrayBuffer(buf.length);
const pairsShared = new Float64Array(sharedBuffer);
const pairs = new Float64Array(buf.buffer, buf.byteOffset, buf.length / Float64Array.BYTES_PER_ELEMENT);
pairsShared.set(pairs, 0);

const midTime = performance.now()
console.log(`reading needed ${(midTime - startTime) / 1000} seconds.`);


const used = process.memoryUsage().rss / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);


let completeSum = 0;
let completeCount = 0;


const workerSliceLength = pairs.length / workers.length;
workers.forEach((worker, workerIndex) => {
  worker.on("error", err => console.error(err));
  worker.on("exit", code => console.log(`Worker exited with code ${code}.`));

  worker.on("message", msg => {
    completeSum += msg.sum;
    completeCount += 1;
    console.log(`Worker message received:`, msg);
    if (completeCount === workers.length) {
      onFinished(completeSum);
    }
  });

  // worker.postMessage({pairs: pairs.slice(workerIndex * workerSliceLength, workerIndex * workerSliceLength + workerSliceLength)});
  worker.postMessage({
    pairs: pairsShared,
    start: workerIndex * workerSliceLength,
    end: workerIndex * workerSliceLength + workerSliceLength
  });
})

function onFinished(sum) {
  const EndTime = performance.now()

  const used2 = process.memoryUsage().rss / 1024 / 1024;
  console.log(`The script uses approximately ${Math.round(used2 * 100) / 100} MB`);

  console.log('Sum:', sum);
  console.log('Read Time:', midTime - startTime);
  console.log('Math Time:', EndTime - midTime);
  console.log('Complete Time:', EndTime - startTime);
}





