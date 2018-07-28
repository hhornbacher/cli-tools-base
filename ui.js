const color = require('chalk').default;
const columnify = require('columnify');

color.warn = color.bold.red;
color.prompt = color.bold.gray;
color.info = color.bold.yellow;
color.userHost = color.bold.green;
color.path = color.bold.blue;

const print = (message) => {
    if (cli.verbosity > 0) console.log(message);
};

const printError = (message) => {
    if (cli.verbosity > 0) console.error(message);
};


global.cli.ui = {
    print,
    printError,
    color,
    columns: columnify,
    ui: clui,
};