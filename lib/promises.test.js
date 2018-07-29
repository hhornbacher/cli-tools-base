const expect = require('chai').expect;

describe('@clitools/base cli.promises', () => {

    before(() => {
        global.cli = {};
        require('./promises');
    });

    after(() => {
        delete global.cli;
    });

    describe('promisify', () => {
        describe('no call argument and no result argument', () => {
            let result;
            beforeEach((done) => {
                const callbackFn = (cb) => cb(null);

                cli.promises.promisify(callbackFn)()
                    .then((x) => {
                        result = 'TEST';
                        done();
                    });
            });


            it('generates promisified function', () => {
                expect(result).to.equal('TEST');
            });
        });

        describe('one call argument and one result argument', () => {
            let result;
            beforeEach((done) => {
                const callbackFn = (arg1, cb) => cb(null, arg1);

                cli.promises.promisify(callbackFn)('TEST')
                    .then((x) => {
                        result = x;
                        done();
                    });
            });


            it('generates promisified function', () => {
                expect(result).to.equal('TEST');
            });
        });

        describe('three call arguments and three result arguments', () => {
            let result;
            beforeEach((done) => {
                const callbackFn = (arg1, arg2, arg3, cb) => cb(null, arg1, arg2, arg3);

                cli.promises.promisify(callbackFn)('TEST1', 'TEST2', 'TEST3')
                    .then((x) => {
                        result = x;
                        done();
                    });
            });


            it('generates promisified function', () => {
                expect(result).to.be.an('array');
                expect(result).to.have.lengthOf(3);
                expect(result).to.contain('TEST1');
                expect(result).to.contain('TEST2');
                expect(result).to.contain('TEST3');
            });
        });

        describe('rejects promise on error', () => {
            let result;
            beforeEach((done) => {
                const callbackFn = (cb) => cb(new Error('TEST ERROR'));

                cli.promises.promisify(callbackFn)()
                    .catch((x) => {
                        result = x;
                        done();
                    });
            });


            it('generates promisified function', () => {
                expect(result).to.be.an('error');
                expect(result.message).to.equal('TEST ERROR');
            });
        });
    });
});