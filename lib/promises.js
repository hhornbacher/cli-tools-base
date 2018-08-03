/**
 * Convert asynchronous function with callback to a promisified version
 * @param {Function} fn Function to convert
 */
const promisify = (fn) => {
    return (...args) => new Promise((resolve, reject) => {
        fn.apply(fn, [
            ...args,
            (error, ...result) => {
                if (error) return reject(error);
                if (result.length == 1) resolve(result[0]);
                else if (result.length > 1) resolve(result);
                else resolve();
            }
        ]);
    });
};

/**
 * Process series of Promises with a delay between each of them
 * @param {Function[]} promiseCbs 
 * @param {number} timeout Milliseconds to wait between requests
 */
const throttle = (promiseCbs, timeout = 150, progress = () => { }) => {
    const _throttleTimeout = (cb) => new Promise(resolve => setTimeout(() => resolve(cb()), timeout));

    const results = [];

    let lastPromise = null;
    const total = promiseCbs.length;
    promiseCbs.forEach((cb, current) => {
        if (lastPromise) {
            lastPromise = lastPromise.then(result => {
                if (result) results.push(result);
                progress(current / total * 100);
            })
                .then(() => _throttleTimeout(cb));
        }
        else {
            lastPromise = cb();
        }
    });


    return lastPromise.then((result) => {
        if (result) results.push(result);
        return results;
    });
};

global.cli.promises = {
    promisify,
    throttle
};