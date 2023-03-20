const Square = 0;
const Rectangle = 1;
const Triangle = 2;
const Circle = 3;

const N = 1_000_000;

function createShapes(n) {
  const shapeType = new Int8Array(n);
  const widthHeight = new Float64Array(n * 2);

  for (let i = 0; i < n; i++) {
    shapeType[i] = i % 4;
    widthHeight[i * 2 + 0] = 1.123;
    widthHeight[i * 2 + 1] = 2.345;
  }

  return {shapeType, widthHeight};
}

const FACTOR_TABLE = new Float64Array([1, 1, 0.5, Math.PI]);

function sumAreaInline(shapes) {
  let sum = 0;
  const {shapeType, widthHeight} = shapes

  for (let i = 0; i < N; i++) {
    sum += FACTOR_TABLE[shapeType[i]] * widthHeight[i * 2] * widthHeight[i * 2 + 1];
  }

  return sum;
}

const shapes = createShapes(N);

let minTime = Number.MAX_VALUE;
for (let i = 0; i < 6; i++) {
  const startTimeNano = process.hrtime.bigint()

  sumAreaInline(shapes);

  const neededTime = Number((process.hrtime.bigint() - startTimeNano)) / 1_000_000;
  minTime = Math.min(neededTime, minTime);
  console.log('neededTime:', neededTime)
}

console.log('minTime:', minTime)

export {};