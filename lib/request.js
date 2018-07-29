const https = require('https');
const http = require('http');
const url = require('url');

/**
 * Make request to http(s) endpoint
 * @param {string} requestUrl URL to the endpoint
 * @param {http.RequestOptions} options HTTP(S) request options
 * @param {string|Buffer} payload Request body payload
 * @returns {Promise} Promise for response
 */
global.cli.request = (requestUrl, options = {}, payload = null) => new Promise((resolve, reject) => {
    const urlObj = url.parse(requestUrl);
    const {
        path,
        host,
        protocol
    } = urlObj;

    const _request = protocol === 'https:' ? https.request : http.request;

    const requestOptions = {
        path,
        host,
        method: 'GET',
        ...options
    };

    if (payload) {
        requestOptions.headers = {
            ...(requestOptions.headers || {}),
            'Content-Length': payload.length
        };
    }

    const req = _request(
        requestOptions,
        (response) => {
            let payload = Buffer.from([]);

            response.on('data', (chunk) => {
                payload = Buffer.concat([payload, chunk]);
            });

            response.on('close', () => {
                if (response.statusCode >= 400) {
                    reject(new Error(response.message));
                } else {
                    resolve({
                        status: response.statusCode,
                        response,
                        payload
                    });
                }
            });
        });

    req.on('error', (error) => {
        reject(error);
    });

    if (payload) {
        req.write(payload);
    }

    req.end();
});