import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from "perf_hooks";
import { loadavg } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EarthRadiuskm = 6372.8;
let Sum = 0

const charCode0 = '0'.charCodeAt(0);
const charCode9 = '9'.charCodeAt(0);

function parseJson(fileContent) {
  const result = [];
  let i = 1;
  const number_buf = new Array(4);
  let number_buf_i = 0;
  while (i < fileContent.length) {
    const char = fileContent[i];
    // console.log('char:', char)
    const charCode = char.charCodeAt(0);
    if ((fileContent[i - 1] === ':' || fileContent[i - 1] === ' ') && (charCode0 <= charCode && charCode <= charCode9 || char === '-')) {
      const numberStartIndex = i;
      i += 1;
      while (i < fileContent.length) {
        const char2 = fileContent[i];
        const char2Code = char2.charCodeAt(0);
        if (!(char2 === '.' || charCode0 <= char2Code && char2Code <= charCode9)) {
          const number_slice = fileContent.slice(numberStartIndex, i);
          // console.log('number_slice:', number_slice)
          const parsed_number = Number.parseFloat(number_slice);
          number_buf[number_buf_i] = parsed_number;
          number_buf_i += 1;
          if (number_buf_i == number_buf.length) {
            number_buf_i = 0;
            result.push({ x0: number_buf[0], y0: number_buf[1], x1: number_buf[2], y1: number_buf[3] });
          }
          break;
        }
        i += 1
      }
    }
    i += 1;
  }
  return result;
}


const startTime = performance.now();

const fileContent = fs.readFileSync(__dirname + '/data/data-1_000_000.json', 'utf8');

const afterReadTime = performance.now();

const pairs = parseJson(fileContent);
// console.log('data2:', data2)
// const data = JSON.parse(fileContent);
// const pairs = data.pairs;
let pairCount = 0;

const afterParseTime = performance.now();

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
console.log('Math Time:', EndTime - afterParseTime);
console.log('Complete Time:', EndTime - startTime);





