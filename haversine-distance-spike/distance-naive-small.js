import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {performance} from "perf_hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EarthRadiuskm = 6372.8;
let Sum = 0




const startTime = performance.now();

const fileContent = fs.readFileSync(__dirname + '/data/data-1_000_000.json', 'utf8');

const afterReadTime = performance.now();


const data = JSON.parse(fileContent);

const afterParseTime = performance.now();


const pairs = data.pairs;
let pairCount = 0;

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
console.log('Read Time:', afterReadTime - startTime);
console.log('Parse Time:', afterParseTime - afterReadTime);
console.log('Math Time:', EndTime - midTime);
console.log('Complete Time:', EndTime - startTime);





