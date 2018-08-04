const https = require('https');

global.cli.api = (host, globalHeaders = {}) => {
    const request = (path, method, payload = null) => new Promise((resolve, reject) => {
        const payloadJSON = payload ? JSON.stringify(payload) : null;

        const headers = {};

        if (payloadJSON) {
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = payloadJSON.length;
        }

        const req = https.request({
            host,
            path,
            method,
            headers: {
                ...globalHeaders,
                ...headers
            }
        }, (res) => {
            let responseData = '';

            res.on('data', (data) => {
                responseData += data;
            });

            res.on('close', () => {
                const response = JSON.parse(responseData);
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    resolve(response);
                }
                else if (res.statusCode === 400 && response.message.path[0] === 'has already been taken') {
                    reject(new Error('Project name already exists.'));
                }
                else if (res.statusCode >= 401 && res.statusCode <= 404) {
                    reject(new Error(res.message));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (payloadJSON) {
            req.write(payloadJSON);
        }

        req.end();
    });
    return {
        get: (path) => request(path, 'GET'),
        post: (path, payload) => request(path, 'POST', payload),
        put: (path, payload) => request(path, 'PUT', payload),
        delete: (path) => request(path, 'DELETE')
    };
};