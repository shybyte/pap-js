const Square = 0;
const Rectangle = 1;
const Triangle = 2;
const Circle = 3;

const FACTOR_TABLE = [1, 1, 0.5, Math.PI];

function createShapes(n) {
  const array = new Float64Array(n * 3);

  for (let i = 0; i < n; i++) {
    array[i * 3] = FACTOR_TABLE[i % 4];
    array[i * 3 + 1] = 1.123;
    array[i * 3 + 2] = 2.234;
  }

  return array;
}


function sumAreaInline(shapes) {
  let sum = 0;

  for (let i = 0; i < shapes.length; i += 3) {
    sum += shapes[i] * shapes[i + 1] * shapes[i + 2];
  }

  return sum;
}

function sumAreaInline2(shapes) {
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < shapes.length; i += 6) {
    sum1 += shapes[i] * shapes[i + 1] * shapes[i + 2];
    sum2 += shapes[i + 3] * shapes[i + 4] * shapes[i + 5];
  }

  return sum1 + sum2;
}


const shapes = createShapes(1_000_000);

let minTime = Number.MAX_VALUE;
for (let i = 0; i < 6; i++) {
  const startTimeNano = process.hrtime.bigint()

  sumAreaInline2(shapes);

  const neededTime = Number((process.hrtime.bigint() - startTimeNano)) / 1_000_000;
  minTime = Math.min(neededTime, minTime);
  console.log('neededTime:', neededTime)
}

console.log('minTime:', minTime)