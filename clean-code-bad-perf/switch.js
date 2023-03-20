const Square = 0;
const Rectangle = 1;
const Triangle = 2;
const Circle = 3;


function createShapes(n) {
  function randomShape() {
    const shapeType = Math.floor(Math.random() * 4);
    return {type: shapeType, width: Math.random() * 10, height: Math.random()}
  }

  return Array.from({length: n}, () => randomShape())
}

function calculateArea(shape) {
  switch (shape.type) {
    case Square:
      return shape.width * shape.height;
    case Rectangle:
      return shape.width * shape.height;
    case Triangle:
      return 0.5 * shape.width * shape.height;
    case Circle:
      return Math.PI * shape.width * shape.height;
  }
}

function sumArea(shapes) {
  let sum = 0;

  for (let i = 0; i < shapes.length; i++) {
    sum += calculateArea(shapes[i]);
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