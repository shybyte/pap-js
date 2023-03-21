import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const n = parseInt(args[1]) || 1_000_000;

const float64Array = new Float64Array(n * 4);

float64Array.forEach((_v, i) => {
  float64Array[i] = Math.random() * 360;
})

console.log('heap', process.memoryUsage().heapUsed / 1024 / 1024);

// console.log('data:', data)

// crashed for n=10_000_000 with "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory"
fs.writeFileSync(`${__dirname}/data/data-${n}.float64`, float64Array);