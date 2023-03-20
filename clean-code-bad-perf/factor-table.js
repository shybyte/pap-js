const Square = 0;
const Rectangle = 1;
const Triangle = 2;
const Circle = 3;


function createShapes(n) {
  function randomShape(i) {
    const shapeType = i % 4;
    return {type: shapeType, width: 1.123, height: 2.234}
  }

  return Array.from({length: n}, (_v, i) => randomShape(i))
}

const FACTOR_TABLE = new Float64Array([1, 1, 0.5, Math.PI]);

function calculateArea(shape) {
  return FACTOR_TABLE[shape.type] * shape.width * shape.height;
}

function sumArea(shapes) {
  let sum = 0;

  for (let i = 0; i < shapes.length; i++) {
    sum += calculateArea(shapes[i]);
  }

  return sum;
}

function sumAreaInline(shapes) {
  let sum = 0;

  for (let i = 0; i < shapes.length; i++) {
    const shape = shapes[i];
    sum += FACTOR_TABLE[shape.type] * shape.width * shape.height;
  }

  return sum;
}

function sumArea5(shapes) {
  let sum0 = 0;
  let sum1 = 0;
  let sum2 = 0;
  let sum3 = 0;
  let sum4 = 0;

  for (let i = 0; i < shapes.length; i += 5) {
    sum0 += calculateArea(shapes[i]);
    sum1 += calculateArea(shapes[i + 1]);
    sum2 += calculateArea(shapes[i + 2]);
    sum3 += calculateArea(shapes[i + 3]);
    sum4 += calculateArea(shapes[i + 4]);
  }

  return sum0 + sum1 + sum2 + sum3 + sum4;
}

const shapes = createShapes(1_000_000);

let minTime = Number.MAX_VALUE;
for (let i = 0; i < 6; i++) {
  const startTimeNano = process.hrtime.bigint()

  sumArea(shapes);

  const neededTime = Number((process.hrtime.bigint() - startTimeNano)) / 1_000_000;
  minTime = Math.min(neededTime, minTime);
  console.log('neededTime:', neededTime)
}

console.log('minTime:', minTime)

export {};