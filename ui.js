const color = require('chalk').default;
const columnify = require('columnify');
const clui = require('columnify');

color.warn = color.bold.red;
color.prompt = color.bold.gray;
color.info = color.bold.yellow;
color.userHost = color.bold.green;
color.path = color.bold.blue;

const print = console.log;

module.exports = {
    print,
    color,
    columns: columnify,
    ui: clui,
};