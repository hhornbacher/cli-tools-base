const expect = require('chai').expect;


const exitBackup = global.process.exit;
const onBackup = global.process.on;
const testEnv = {
    printBuffer: '',
    showedHelp: false,
    exited: false
};

describe('@clitools/base cli.errorHandler', () => {

    before(() => {
        global.process.exit = () => { testEnv.exited = true; };
        global.process.on = (event, cb) => {
            if (event !== 'unhandledRejection') onBackup(event, cb);
            return;
        };
        global.cli = {
            program: {
                showHelp: () => { testEnv.showedHelp = true; }
            },
            verbosity: 1
        };
        require('./ui');
        global.cli.ui.print = (str) => {
            testEnv.printBuffer += str;
        };
        require('./error-handler');
    });

    afterEach(() => {
        testEnv.printBuffer = '';
        testEnv.showedHelp = false;
        testEnv.exited = false;
    });

    after(() => {
        delete global.cli;
        global.process.exit = exitBackup;
        global.process.on = onBackup;
    });

    describe('verbosity: 1 (default)', () => {

        before(() => {
            global.cli.verbosity = 1;
        });

        describe('with message', () => {
            beforeEach(() => {
                cli.errorHandler('TEST ERROR');
            });


            it('generates correct error information', () => {
                expect(testEnv.printBuffer).to.equal('\u001b[1m\u001b[33mUsage:\u001b[39m\u001b[22m\n\n\u001b[1m\u001b[31mError:\u001b[39m\u001b[22m\u001b[1mTEST ERROR\u001b[22m');
                expect(testEnv.exited).to.equal(true);
            });
        });

        describe('with message and error', () => {
            beforeEach(() => {
                cli.errorHandler('TEST ERROR', new Error('TEST ERROR XXX'));
            });


            it('generates correct error information', () => {
                expect(testEnv.printBuffer).to.equal('\u001b[1m\u001b[33mUsage:\u001b[39m\u001b[22m\n\n\u001b[1m\u001b[31mError:\u001b[39m\u001b[22m\u001b[1mTEST ERROR\u001b[22m');
                expect(testEnv.exited).to.equal(true);
            });
        });

        describe('with error', () => {
            beforeEach(() => {
                cli.errorHandler(null, new Error('TEST ERROR'));
            });


            it('generates correct error information', () => {
                expect(testEnv.printBuffer).to.equal('\n\n\u001b[1m\u001b[31mError:\u001b[39m\u001b[22m\u001b[1mTEST ERROR\u001b[22m');
                expect(testEnv.exited).to.equal(true);
            });
        });

        describe('without arguments', () => {
            beforeEach(() => {
                cli.errorHandler();
            });


            it('generates correct error information', () => {
                expect(testEnv.printBuffer).to.equal('\u001b[1m\u001b[31mError:\u001b[39m\u001b[22m\n\u001b[1m\u001b[31m\u001b[39m\u001b[22m Unkown error!');
                expect(testEnv.exited).to.equal(true);
            });
        });
    });

    describe('verbosity: 0', () => {

        before(() => {
            global.cli.verbosity = 0;
        });

        describe('with message', () => {
            beforeEach(() => {
                cli.errorHandler('TEST ERROR');
            });


            it('no output', () => {
                expect(testEnv.printBuffer).to.equal('');
                expect(testEnv.exited).to.equal(true);
            });
        });

        describe('with message and error', () => {
            beforeEach(() => {
                cli.errorHandler('TEST ERROR', new Error('TEST ERROR XXX'));
            });


            it('no output', () => {
                expect(testEnv.printBuffer).to.equal('');
                expect(testEnv.exited).to.equal(true);
            });
        });

        describe('with error', () => {
            beforeEach(() => {
                cli.errorHandler(null, new Error('TEST ERROR'));
            });


            it('no output', () => {
                expect(testEnv.printBuffer).to.equal('');
                expect(testEnv.exited).to.equal(true);
            });
        });

        describe('without arguments', () => {
            beforeEach(() => {
                cli.errorHandler();
            });


            it('no output', () => {
                expect(testEnv.printBuffer).to.equal('');
                expect(testEnv.exited).to.equal(true);
            });
        });
    });

    describe('verbosity: 1 , debugMode: true', () => {

        before(() => {
            global.cli.verbosity = 1;
            global.cli.debugMode = true;
        });

        describe('with message', () => {
            beforeEach(() => {
                cli.errorHandler('TEST ERROR');
            });


            it('generates correct error information', () => {
                expect(testEnv.printBuffer).to.equal('\u001b[1m\u001b[33mUsage:\u001b[39m\u001b[22m\n\n\u001b[1m\u001b[31mError:\u001b[39m\u001b[22m\u001b[1mTEST ERROR\u001b[22m');
                expect(testEnv.exited).to.equal(true);
            });
        });

        describe('with message and error', () => {
            let result;
            beforeEach(() => {
                try {
                    cli.errorHandler('TEST ERROR', new Error('TEST ERROR XXX'));
                } catch (error) {
                    result = error;
                }
            });


            it('generates correct error information', () => {
                expect(result.message).to.equal('TEST ERROR XXX');
            });
        });

        describe('with error', () => {
            let result;
            beforeEach(() => {
                try {
                    cli.errorHandler(null, new Error('TEST ERROR YYY'));
                } catch (error) {
                    result = error;
                }
            });


            it('generates correct error information', () => {
                expect(result.message).to.equal('TEST ERROR YYY');
            });
        });

        describe('without arguments', () => {
            beforeEach(() => {
                cli.errorHandler();
            });


            it('generates correct error information', () => {
                expect(testEnv.printBuffer).to.equal('\u001b[1m\u001b[31mError:\u001b[39m\u001b[22m\n\u001b[1m\u001b[31m\u001b[39m\u001b[22m Unkown error!');
                expect(testEnv.exited).to.equal(true);
            });
        });
    });
});