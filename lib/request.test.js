const expect = require('chai').expect;
const Module = require('module');

const requireBackup = Module.prototype.require;

const testEnv = {
    protocol: null,
    responseStatus: 200,
    responseEventCbs: {},
    requestOptions: {},
    requestEventCbs: {},
    requestPayload: null
};

describe('@clitools/base cli.request', () => {

    before(() => {
        Module.prototype.require = function (moduleName) {
            if (!/https?/.test(moduleName)) return requireBackup.apply(this, [moduleName]);
            return {
                request: (options, cb) => {
                    testEnv.protocol = moduleName;
                    testEnv.requestOptions = options;
                    cb({
                        statusCode: testEnv.responseStatus,
                        on: (event, eventCb) => {
                            testEnv.responseEventCbs[event] = eventCb;
                        }
                    });

                    return {
                        on: (event, eventCb) => {
                            testEnv.requestEventCbs[event] = eventCb;
                        },
                        write: (payload) => {
                            testEnv.requestPayload = payload;
                        },
                        end: () => { }
                    };
                }
            };
        };
        global.cli = {};
        require('./request');
    });

    afterEach(() => {
        testEnv.protocol = null;
        testEnv.responseStatus = 200;
        testEnv.responseEventCbs = {};
        testEnv.requestOptions = {};
        testEnv.requestEventCbs = {};
        testEnv.requestPayload = null;
        testEnv.calledEnd = false;
    });

    after(() => {
        delete global.cli;
        Module.prototype.require = requireBackup;
    });

    describe('HTTP GET request, without options', () => {
        let result;
        beforeEach((done) => {
            cli.request('http://foob.bar/test-endpoint')
                .then((response) => {
                    result = response;
                    done();
                });

            testEnv.responseEventCbs.data(Buffer.from('Test Payload', 'utf8'));
            testEnv.responseEventCbs.close();
        });

        it('generates correct request parameters', () => {
            expect(testEnv.requestOptions.host).to.equal('foob.bar');
            expect(testEnv.requestOptions.path).to.equal('/test-endpoint');
            expect(testEnv.requestOptions.method).to.equal('GET');
            expect(testEnv.protocol).to.equal('http');
            expect(result.status).to.equal(200);
            expect(result.payload.toString('utf8')).to.equal('Test Payload');
        });
    });

    describe('HTTPS GET request, without options', () => {
        let result;
        beforeEach((done) => {
            cli.request('https://foob.bar/test-endpoint')
                .then((response) => {
                    result = response;
                    done();
                });

            testEnv.responseEventCbs.data(Buffer.from('Test Payload', 'utf8'));
            testEnv.responseEventCbs.close();
        });

        it('generates correct request parameters', () => {
            expect(testEnv.requestOptions.host).to.equal('foob.bar');
            expect(testEnv.requestOptions.path).to.equal('/test-endpoint');
            expect(testEnv.requestOptions.method).to.equal('GET');
            expect(testEnv.protocol).to.equal('https');
            expect(result.status).to.equal(200);
            expect(result.payload.toString('utf8')).to.equal('Test Payload');
        });
    });

    describe('HTTP POST request, without options', () => {
        let result;
        beforeEach((done) => {
            cli.request('http://foob.bar/test-endpoint', {}, { payload: 'TEST' })
                .then((response) => {
                    result = response;
                    done();
                });

            testEnv.responseEventCbs.data(Buffer.from('Test Payload', 'utf8'));
            testEnv.responseEventCbs.close();
        });

        it('generates correct request parameters', () => {
            expect(testEnv.requestOptions.host).to.equal('foob.bar');
            expect(testEnv.requestOptions.path).to.equal('/test-endpoint');
            expect(testEnv.requestOptions.method).to.equal('POST');
            expect(testEnv.protocol).to.equal('http');
            expect(testEnv.requestOptions.headers).to.have.property('Content-Length');
            expect(result.status).to.equal(200);
            expect(result.payload.toString('utf8')).to.equal('Test Payload');
        });
    });

    describe('on error status code >= 400', () => {
        let result;
        beforeEach((done) => {
            testEnv.responseStatus = 400;
            cli.request('http://foob.bar/test-endpoint')
                .catch((response) => {
                    result = response;
                    done();
                });
            testEnv.responseEventCbs.close();
        });

        it('throws error', () => {
            expect(result).to.be.instanceOf(Error);
        });
    });

    describe('on connection error', () => {
        let result;
        beforeEach((done) => {
            cli.request('http://foob.bar/test-endpoint')
                .catch((response) => {
                    result = response;
                    done();
                });
            testEnv.requestEventCbs.error(new Error('Test error'));
        });

        it('throws error', () => {
            expect(result).to.be.instanceOf(Error);
            expect(result.message).to.equal('Test error');
        });
    });
});