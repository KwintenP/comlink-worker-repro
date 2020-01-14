importScripts("https://unpkg.com/comlink/dist/umd/comlink.js");

let otherWorkerProxy;

// API exposed to other workers
const workerAPI = {
    foo: (workerId, message) => {
        console.log(`Message from ${workerId}: ${message}`)
    }
};

// API exposed to main thread
const mainThreadAPI = {
    connectToWorker: (port, expose, id) => {
        // Expose boolean is a trick so it is only exposed on one
        // worker, not the other. In reality, I'd want both to
        // be exposed, but this fails
        if(expose) {
            // I expose this workerApi on the port I received from the other worker
            Comlink.expose(workerAPI, port);
        }

        // Wrap around the port so I can send a message to the other worker
        otherWorkerProxy = Comlink.wrap(port);
        otherWorkerProxy.foo(id, 'Hi');
    },
};

Comlink.expose(mainThreadAPI);
