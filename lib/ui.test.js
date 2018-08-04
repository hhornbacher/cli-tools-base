const expect = require('chai').expect;
const mockRequire = require('mock-require');

const logBackup = console.log;
const errorBackup = console.error;
const testEnv = {
    log: '',
    error: '',
    progress: {
        start: null
    }
};

describe('@clitools/base cli.ui', () => {
    before(() => {
        global.cli = {
            verbosity: 1
        };

        global.console.log = (input) => {
            testEnv.log += input;
        };

        global.console.error = (input) => {
            testEnv.error += input;
        };


        function Progress() {
        }
        Progress.prototype.start = (max, pos) => {
            testEnv.progress.start = { max, pos };
        };
        mockRequire('cli-progress', {
            Bar: Progress,
            Presets: {
                shades_classic: 'shades_classic'
            }
        });


        require('./ui');
    });

    after(() => {
        mockRequire.stopAll();
        delete global.cli;
        global.console.log = logBackup;
        global.console.error = errorBackup;
    });


    describe('print', () => {

        afterEach(() => {
            testEnv.log = '';
            testEnv.error = '';
        });

        describe('print (verbosity: 1)', () => {
            before(() => {
                global.cli.verbosity = 1;

                global.cli.ui.print('Test Log');
            });

            it('prints text to stdout', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m\u001b[0m%s%s\u001b[0mTest Log');
            });
        });
        describe('print (verbosity: 0)', () => {
            before(() => {
                global.cli.verbosity = 0;

                global.cli.ui.print('Test Log');
            });

            it('no output', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m');
            });
        });


        describe('print error (verbosity: 1)', () => {
            before(() => {
                global.cli.verbosity = 1;

                global.cli.ui.print('Test Error', 'error');
            });

            it('prints text to stderr', () => {
                expect(testEnv.error).to.equal('Test Error');
            });
        });
        describe('print error (verbosity: 0)', () => {
            before(() => {
                global.cli.verbosity = 0;

                global.cli.ui.print('Test Error', 'error');
            });

            it('no output', () => {
                expect(testEnv.error).to.equal('');
            });
        });
    });

    describe('progress bar', () => {
        afterEach(() => {
            testEnv.log = '';
            testEnv.error = '';
            testEnv.progress.start = null;
        });

        describe('startProgress (verbosity: 1)', () => {
            before(() => {
                global.cli.verbosity = 1;

                global.cli.ui.startProgress('Test Title', 69);
            });
            after(() => {
                delete global.cli.ui._progressBar;
            });


            it('generates progress bar', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m\u001b[0m%s%s\u001b[0mTest Title\n');
                expect(testEnv.progress.start.max).to.equal(69);
            });
        });

        describe('startProgress, without message (verbosity: 1)', () => {
            before(() => {
                global.cli.verbosity = 1;

                global.cli.ui.startProgress(null, 78);
            });
            after(() => {
                delete global.cli.ui._progressBar;
            });


            it('generates progress bar', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m');
                expect(testEnv.progress.start.max).to.equal(78);
            });
        });
        describe('startProgress (verbosity: 0)', () => {
            before(() => {
                global.cli.verbosity = 0;

                global.cli.ui.startProgress(71);
            });
            after(() => {
                delete global.cli.ui._progressBar;
            });


            it('no output', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m');
                expect(testEnv.progress.start).to.equal(null);
            });
        });

        describe('updateProgress (verbosity: 1)', () => {
            let update;
            before(() => {
                global.cli.verbosity = 1;
                global.cli.ui._progressBar = {
                    update: (steps) => { update = steps; }
                };

                global.cli.ui.updateProgress(69);
            });
            after(() => {
                delete global.cli.ui._progressBar;
            });


            it('generates progress bar', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m');
                expect(update).to.equal(69);
            });
        });
        describe('updateProgress (verbosity: 0)', () => {
            let update = false;
            before(() => {
                global.cli.verbosity = 0;
                global.cli.ui._progressBar = {
                    update: () => { update = true; }
                };

                global.cli.ui.updateProgress(69);
            });
            after(() => {
                delete global.cli.ui._progressBar;
            });


            it('no output', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m');
                expect(update).to.equal(false);
            });
        });


        describe('stopProgress (verbosity: 1)', () => {
            let update;
            let stop = false;
            before(() => {
                global.cli.verbosity = 1;
                global.cli.ui._progressMax = 100;
                global.cli.ui._progressBar = {
                    update: (steps) => { update = steps; },
                    stop: () => { stop = true; }
                };

                global.cli.ui.stopProgress();
            });
            after(() => {
                delete global.cli.ui._progressBar;
                delete global.cli.ui._progressMax;
            });


            it('generates progress bar', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m\n');
                expect(update).to.equal(100);
                expect(stop).to.equal(true);
            });
        });
        describe('stopProgress (verbosity: 0)', () => {
            let update = false;
            let stop = false;
            before(() => {
                global.cli.verbosity = 0;
                global.cli.ui._progressMax = 100;
                global.cli.ui._progressBar = {
                    update: () => { update = true; },
                    stop: () => { stop = true; }
                };

                global.cli.ui.stopProgress();
            });
            after(() => {
                delete global.cli.ui._progressBar;
                delete global.cli.ui._progressMax;
            });


            it('no output', () => {
                expect(testEnv.log).to.equal('\u001b[0m%s%s\u001b[0m');
                expect(stop).to.equal(false);
                expect(update).to.equal(false);
            });
        });
    });
});