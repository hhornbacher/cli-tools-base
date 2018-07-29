global.cli.promises = {
    throttle: (promiseCbs, timeout = 300) => {
        const _throttleTimeout = (cb) => new Promise(resolve => setTimeout(() => resolve(cb()), timeout));

        const results = [];

        let lastPromise = null;
        promiseCbs.forEach((cb, i) => {
            if (lastPromise) {
                lastPromise.then(result => {
                    if (result) results.push(result);
                });
                lastPromise = _throttleTimeout(cb);
            }
            else {
                lastPromise = _throttleTimeout(cb);
            }
        });


        return lastPromise.then((result) => {
            if (result) results.push(result);
            return results;
        });
    }
};