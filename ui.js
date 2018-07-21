const color = require('chalk').default;
const columnify = require('columnify');
const clui = require('columnify');

color.warn = color.bold.red;
color.prompt = color.bold.gray;
color.info = color.bold.yellow;
color.userHost = color.bold.green;
color.path = color.bold.blue;

let verbosity = 1;

const print = (message) => {
    if (verbosity > 0) console.log(message);
};

const printError = (message) => {
    if (verbosity > 0) console.error(message);
};

const setVerbosity = (verbose) => {
    verbosity = verbose;
};

const getVerbosity = () => verbosity;

module.exports = {
    setVerbosity,
    getVerbosity,
    print,
    printError,
    color,
    columns: columnify,
    ui: clui,
};