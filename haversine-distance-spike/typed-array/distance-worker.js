import {parentPort} from "worker_threads";
import {performance} from "perf_hooks";

const EarthRadiuskm = 6371

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

function calculateSum(pairs, start, end) {
  const startTime = performance.now();
  let Sum = 0
  for (let i = start; i < end; i += 4) {
    Sum += HaversineOfDegrees(pairs[i], pairs[i + 1], pairs[i + 2], pairs[i + 3], EarthRadiuskm);
  }

  const endTime = performance.now() - startTime;
  console.log('workerTime:', endTime);
  return Sum;
}

parentPort.on("message", data => {
  console.log('data length:', data.pairs.length)
  parentPort.postMessage({sum: calculateSum(data.pairs, data.start, data.end)});
  // parentPort.postMessage({sum: calculateSum(data.pairs)});
});