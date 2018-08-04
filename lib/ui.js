const color = require('chalk').default;
const columnify = require('columnify');
const progress = require('cli-progress');
const inquirer = require('inquirer');

color.warn = color.bold.red;
color.prompt = color.bold.gray;
color.info = color.bold.yellow;
color.userHost = color.bold.green;
color.path = color.bold.blue;

const print = (message, type = 'info') => {
    if (cli.verbosity > 0 && type !== 'debug') {
        if (type === 'error') {
            console.error(message);
        } else {
            console.log(message);
        }
    } else if (type === 'debug' && cli.debugMode) {
        console.log(message);
    }
};

const printError = message => print(message, 'error');
const printDebug = message => print(message, 'debug');

const startProgress = (message, progressMax = 100) => {
    if (cli.verbosity > 0) {
        if (message) {
            console.log(message + '\n');
        }
        cli.ui._progressBar = new progress.Bar({}, progress.Presets.shades_classic);
        cli.ui._progressBar.start(progressMax, 0);
        cli.ui._progressMax = progressMax;
    }
};

const updateProgress = (steps) => {
    if (cli.verbosity > 0) {
        cli.ui._progressBar.update(steps);
    }
};

const stopProgress = () => {
    if (cli.verbosity > 0) {
        cli.ui._progressBar.update(cli.ui._progressMax);
        cli.ui._progressBar.stop();
        console.log('\n');
    }
};


global.cli.ui = {
    print,
    printError,
    printDebug,
    color,
    columns: columnify,
    prompt: inquirer,
    startProgress,
    updateProgress,
    stopProgress
};