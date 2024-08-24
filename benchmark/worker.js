// This script is used as a Web Worker for benchmark.js.

(async () => {
    const { default: runJob } = await import('./run-job.js');

    onmessage = async ({ data }) => {
        const { type, numIterations, numPrototypes, config } = data;

        const result = await runJob(type, numIterations, numPrototypes, config);

        postMessage({ result });
    };
})();
