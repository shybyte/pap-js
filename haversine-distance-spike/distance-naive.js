import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import events from "events";
import readline from "readline";
import {performance} from "perf_hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EarthRadiuskm = 6371
let Sum = 0

// Will fail with Error: Cannot create a string longer than 0x1fffffe8 characters
// const data = JSON.parse(fs.readFileSync(__dirname + '/data/data-10000000.json', 'utf8'));

async function processLineByLine(file, callback) {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(file),

      crlfDelay: Infinity
    });

    let i = 0;
    rl.on('line', (line) => {
      callback(line, i);
    });

    await events.once(rl, 'close');

    console.log('Reading file line by line with readline done.');
  } catch (err) {
    console.error(err);
  }
}


const startTime = performance.now();

const pairs = [];
let pairCount = 0;
await processLineByLine(__dirname + '/data/data-1000000.json', (line, i) => {
  if (line.startsWith('{"x0":')) {
    const withoutCommaAtEnd = line.replace(/\},/, '}');
    const pair = JSON.parse(withoutCommaAtEnd);
    pairs.push(pair);
    // Sum += HaversineOfDegrees(pair.x0, pair.y0, pair.x1, pair.y1, EarthRadiuskm)
    // pairCount += 1;
  }
});

const midTime = performance.now()
console.log(`reading needed ${(midTime - startTime) / 1000} seconds.`);

console.log('points.length:', pairs.length)


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


for (const pair of pairs) {
  Sum += HaversineOfDegrees(pair.x0, pair.y0, pair.x1, pair.y1, EarthRadiuskm)
  pairCount += 1
}
const Average = Sum / pairCount
const EndTime = performance.now()

const used = process.memoryUsage().rss / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
console.log('pairCount:', pairCount);
console.log('Average:', Average);
console.log('Read Time:', midTime - startTime);
console.log('Math Time:', EndTime - midTime);
console.log('Complete Time:', EndTime - startTime);





