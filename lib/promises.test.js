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
                    .then(() => {
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

    describe('throttle', () => {
        describe('timeout between promieses', () => {
            let start;
            let end;
            let result;
            beforeEach((done) => {
                start = new Date();
                cli.promises.throttle([
                    () => Promise.resolve('A'),
                    () => Promise.resolve('B'),
                    () => Promise.resolve('C'),
                    () => Promise.resolve('D')
                ], 300)
                    .then((x) => {
                        end = new Date();
                        result = x;
                        done();
                    });
            });

            it('works', () => {
                expect(end - start).to.gte(900);
                expect(result).to.have.lengthOf(4);
                expect(result).to.contain('A');
                expect(result).to.contain('B');
                expect(result).to.contain('C');
                expect(result).to.contain('D');
            });
        });

        describe('progress callback', () => {
            const progress = [];
            beforeEach((done) => {
                cli.promises.throttle([
                    () => Promise.resolve('A'),
                    () => Promise.resolve('B'),
                    () => Promise.resolve('C'),
                    () => Promise.resolve('D'),
                    () => Promise.resolve('E'),
                    () => Promise.resolve('F'),
                    () => Promise.resolve('G'),
                    () => Promise.resolve('H'),
                    () => Promise.resolve('I'),
                    () => Promise.resolve('X')
                ], 50, (p) => progress.push(p))
                    .then(() => done());
            });

            it('works', () => {
                expect(progress).to.have.lengthOf(9);
                expect(progress).to.contain(10);
                expect(progress).to.contain(20);
                expect(progress).to.contain(30);
                expect(progress).to.contain(40);
                expect(progress).to.contain(50);
                expect(progress).to.contain(60);
                expect(progress).to.contain(70);
                expect(progress).to.contain(80);
                expect(progress).to.contain(90);
            });
        });
    });
});