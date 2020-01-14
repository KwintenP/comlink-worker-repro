import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";

const worker1 = new Worker('worker.js');

const worker1Proxy = Comlink.wrap(worker1);


// After some time, a second worker spins up
// I want the second one to be able to communicate
// with the first one. I create a two ports and would
// like to use these ports in the workers to create
// a two-way communication channel using Comlink proxies
// on both sides.
setTimeout(() => {
    const {port1, port2} = new MessageChannel();
    // Send one port to worker 1
    worker1Proxy.connectToWorker(Comlink.transfer(port1, [port1]), true, 1);

    // Spin up a new worker
    const worker2 = new Worker('worker.js');
    const worker2Proxy = Comlink.wrap(worker2);
    // Send one port to worker 2
    worker2Proxy.connectToWorker(Comlink.transfer(port2, [port2]), false, 2);
    // COMMENT THIS LINE IN TO SEE THAT EXPOSING BOTH OF THEM BREAKS
    // worker2Proxy.connectToWorker(Comlink.transfer(port2, [port2]), true, 2);
});
