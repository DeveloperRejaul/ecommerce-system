// eslint-disable-next-line no-unused-vars
const {parentPort, workerData } = require('worker_threads');

parentPort.postMessage('hello world');
