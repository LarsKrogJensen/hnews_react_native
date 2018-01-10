import fbPerformanceNow from 'fbjs/lib/performanceNow';

const PerformanceNow = fbPerformanceNow;

let counts = {};
const startTimes = {};

console.time = console.time || ((label: string) => {
    startTimes[label] = PerformanceNow();
});

console.timeEnd = console.timeEnd || ((label: string) => {
    let endTime = PerformanceNow();
    if (startTimes[label]) {
        let delta = endTime - startTimes[label];
        console.log(`${label}: ${delta.toFixed(3)}ms`);
        delete startTimes[label];
    } else {
        console.warn(`Warning: No such label '${label}' for console.timeEnd()`);
    }
});

console.count = console.count || ((label = '<no label>') => {
    if (!counts[label])
        counts[label] = 0;

    counts[label]++;
    console.log(`${label}: ${counts[label]}`);
});