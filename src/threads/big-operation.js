// eslint-disable-next-line no-unused-vars
import { parentPort, workerData } from 'worker_threads';

parentPort.postMessage('hello world');
