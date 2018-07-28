const color = require('chalk').default;
const columnify = require('columnify');
const progress = require('cli-progress');
const ora = require('ora');

color.warn = color.bold.red;
color.prompt = color.bold.gray;
color.info = color.bold.yellow;
color.userHost = color.bold.green;
color.path = color.bold.blue;

const print = (message, type = 'info') => {
    if (cli.verbosity > 0) {
        if (type === 'error') {
            console.error(message);
        } else {
            console.log(message);
        }
    }
};

const startProgress = (message) => {
    if (cli.verbosity > 0) {
        if (message) {
            cli.ui._statusSpinner = ora(message).start();
            console.log('\n');
        }
        cli.ui._progressBar = new progress.Bar({}, progress.Presets.shades_classic);
        cli.ui._progressBar.start(100, 0);
    }
};

const updateProgress = (percent, message = null) => {
    if (cli.verbosity > 0) {
        cli._progressBar.update(percent);

        if (message) {
            if (!cli.ui._statusSpinner) {
                cli.ui._statusSpinner = ora(message).start();
                console.log('\n');
            }
            else {
                cli.ui._statusSpinner.stop();
                cli.ui._statusSpinner = ora(message).start();
                console.log('\n');
            }
        }
    }
};

const stopProgress = () => {
    if (cli.verbosity > 0) {
        cli._progressBar.stop();

        if (cli.ui._statusSpinner) cli.ui._statusSpinner.stop();
    }
};


global.cli.ui = {
    print,
    color,
    columns: columnify,
    startProgress,
    updateProgress,
    stopProgress
};