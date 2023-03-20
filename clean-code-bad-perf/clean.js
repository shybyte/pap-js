class Square {
  #side

  constructor(side) {
    this.#side = side;
  }

  area() {
    return this.#side * this.#side;
  }
}

class Rectangle {
  #width
  #height

  constructor(width, height) {
    this.#width = width;
    this.#height = height;
  }

  area() {
    return this.#width * this.#height;
  }
}

class Triangle {
  #base
  #height

  constructor(base, height) {
    this.#base = base;
    this.#height = height;
  }

  area() {
    return 0.5 * this.#base * this.#height;
  }
}

class Circle {
  #radius

  constructor(radius) {
    this.#radius = radius;
  }

  area() {
    return Math.PI * this.#radius * this.#radius;
  }
}

function sumArea(shapes) {
  let sum = 0;

  for (let i = 0; i < shapes.length; i++) {
    sum += shapes[i].area();
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
    sum0 += shapes[i].area();
    sum1 += shapes[i + 1].area();
    sum2 += shapes[i + 2].area();
    sum3 += shapes[i + 3].area();
    sum4 += shapes[i + 4].area();
  }

  return sum0 + sum1 + sum2 + sum3 + sum4;
}

function createShapes(n) {
  function randomShape() {
    const shapeType = Math.floor(Math.random() * 4);
    switch (shapeType) {
      case 0:
        return new Square(Math.random() * 10);
      case 1:
        return new Rectangle(Math.random() * 10, Math.random() * 10);
      case 2:
        return new Triangle(Math.random() * 10, Math.random() * 10);
      case 3:
        return new Circle(Math.random() * 10);
      default:
        throw new Error('Invalid shapeType');
    }
  }

  return Array.from({length: n}, () => randomShape())
}

const shapes = createShapes(1_000_000);

let minTime = Number.MAX_VALUE;
for (let i = 0; i < 20; i++) {
  const startTimeNano = process.hrtime.bigint()

  sumArea(shapes);

  const neededTime = Number((process.hrtime.bigint() - startTimeNano)) / 1_000_000;
  minTime = Math.min(neededTime, minTime);
  console.log('neededTime:', neededTime)
}

console.log('minTime:', minTime)


export {};
