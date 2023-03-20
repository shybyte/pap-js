import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const n = parseInt(args[1]) || 10_000_000;
const data = {
  points: Array.from({length: n}, () => (
      {
        x0: Math.random() * 360,
        y0: Math.random() * 360,
        x1: Math.random() * 360,
        y1: Math.random() * 360,
      }
    )
  )
};

console.log('heap', process.memoryUsage().heapUsed / 1024 / 1024);

// console.log('data:', data)

// crashed for n=10_000_000 with "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory"
// fs.writeFileSync(`${__dirname}/data/data-${n}.json`, JSON.stringify(data, null, 2));

const file = fs.openSync(`${__dirname}/data/data-${n}.json`, 'w');
fs.writeSync(file, '{"pairs": [\n');

data.points.forEach((point, i) => {
  fs.writeSync(file, JSON.stringify(point) + (i < data.points.length - 1 ? ',\n' : '\n'));
});


fs.writeSync(file, ']}');
