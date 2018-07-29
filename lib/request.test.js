const expect = require('chai').expect;
const Module = require('module');

const requireBackup = Module.prototype.require;

const testEnv = {
    requestOptions: {},
    responseEventCbs: {},
    requestEventCbs: {},
    requestPayload: null
};

describe('@clitools/base cli.request', () => {

    before(() => {
        Module.prototype.require = function (moduleName) {
            if (!/https?/.test(moduleName)) return requireBackup.apply(this, [moduleName]);
            return {
                request: (options, cb) => {
                    testEnv.requestOptions = options;
                    cb({
                        statusCode: 200,
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
        testEnv.requestOptions = {};
        testEnv.responseEventCbs = {};
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

        it('generates promisified function', () => {
            expect(testEnv.requestOptions.host).to.equal('foob.bar');
            expect(testEnv.requestOptions.path).to.equal('/test-endpoint');
            expect(testEnv.requestOptions.method).to.equal('GET');
            expect(result.status).to.equal(200);
            expect(result.payload.toString('utf8')).to.equal('Test Payload');
        });
    });
});