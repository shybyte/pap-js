const COMPLETE_N = 1e8;
const N = 1e5;
const N2 = COMPLETE_N / N;

// L1 Cache => 128*1024/8 = 16384
// L2 Cache => 1*1024*1024/8 = 131072
// L3 Cache => 6*1024*1024/8 = 786432

function createArray() {
  const array = new Float64Array(N);
  for (let i = 0; i < array.length; i++) {
    array[i] = i;
  }
  return array;
}

function sum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function sumForEach(array) {
  let sum = 0;
  array.forEach(x => {
    sum += x;
  })
  return sum;
}

function sumReduce(array) {
  return array.reduce((sum, x) => sum + x, 0)
}

function sumForOf(array) {
  let sum = 0;
  for (const x of array) {
    sum += x;
  }
  return sum;
}

function sumReduceWithGetter(array, getX) {
  return array.reduce((sum, el) => sum + getX(el), 0);
}

function sumUnroll(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i += 4) {
    sum += array[i];
    sum += array[i + 1];
    sum += array[i + 2];
    sum += array[i + 3];
  }
  return sum;
}

function sum2(array) {
  let sum1 = 0;
  let sum2 = 0;
  for (let i = 0; i < array.length; i += 2) {
    sum1 += array[i];
    sum2 += array[i + 1];
  }
  return sum1 + sum2;
}

function sum5(array) {
  let sum1 = 0;
  let sum2 = 0;
  let sum3 = 0;
  let sum4 = 0;
  let sum5 = 0;
  for (let i = 0; i < array.length; i += 5) {
    sum1 += array[i];
    sum2 += array[i + 1];
    sum3 += array[i + 2];
    sum4 += array[i + 3];
    sum5 += array[i + 4];
  }
  return sum1 + sum2 + sum3 + sum4 + sum5;
}

const array = createArray();
console.log('array.length:', array.length)

let minTime = Number.MAX_VALUE;
for (let i = 0; i < 6; i++) {
  const startTime = Date.now();

  let completeSum = 0;
  for (let i = 0; i < N2; i++) {
    completeSum += sum5(array);
  }

  const neededTime = Date.now() - startTime;
  minTime = Math.min(neededTime, minTime);
  console.log('completeSum:', completeSum, neededTime)
}

console.log('minTime:', minTime)
console.log("ops per microsecond", COMPLETE_N / (minTime * 1000));