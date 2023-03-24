import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import events from "events";
import readline from "readline";
import {performance} from "perf_hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EarthRadiuskm = 6371

function waitMs(timeMs) {
  return new Promise(resolve => {
    setTimeout(resolve, timeMs);
  })
}

await waitMs(100);

const startTime = performance.now();

const buf = fs.readFileSync(__dirname + '/data/data-1000000.float64');
const pairs = new Float64Array(buf.buffer, buf.byteOffset, buf.length / Float64Array.BYTES_PER_ELEMENT);

const midTime = performance.now()
console.log(`reading needed ${(midTime - startTime) / 1000} seconds.`);


function radians(degrees) {
  return degrees * (Math.PI / 180);
}

function HaversineOfDegrees(x0, y0, x1, y1, R) {
  const dY = radians(y1 - y0)
  const dX = radians(x1 - x0)
  const Y0 = radians(y0)
  const Y1 = radians(y1)

  const RootTerm = (Math.sin(dY / 2) ** 2) + Math.cos(Y0) * Math.cos(Y1) * (Math.sin(dX / 2) ** 2)
  return 2 * R * Math.asin(Math.sqrt(RootTerm))
}

const used = process.memoryUsage().rss / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

let pairCount = 0;
let Sum = 0
for (let i = 0; i < pairs.length; i += 4) {
  Sum += HaversineOfDegrees(pairs[i], pairs[i + 1], pairs[i + 2], pairs[i + 3], EarthRadiuskm);
}
pairCount = pairs.length / 4;

const Average = Sum / pairCount
const EndTime = performance.now()


const used2 = process.memoryUsage().rss / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used2 * 100) / 100} MB`);

console.log('Sum:', Sum);
console.log('Average:', Average);
console.log('pairCount:', pairCount);
console.log('Read Time:', midTime - startTime);
console.log('Math Time:', EndTime - midTime);
console.log('Complete Time:', EndTime - startTime);





