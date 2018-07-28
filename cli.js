// Modules
const program = require('yargs');
const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');

// Internal modules
const config = require('./config');
const ui = require('./ui');
const api = require('./api');

// Program information
const programName = path.basename(process.argv[1]);

let debugMode = false;


const getProgramVersion = () => {
    const getCallerFile = () => {
        try {
            var err = new Error();
            var callerfile;
            var currentfile;

            Error.prepareStackTrace = function (err, stack) { return stack; };

            currentfile = err.stack.shift().getFileName();

            while (err.stack.length) {
                callerfile = err.stack.shift().getFileName();

                if (currentfile !== callerfile) return callerfile;
            }
        } catch (err) { }
        return undefined;
    };

    const programPath = path.dirname(getCallerFile());
    let depth = 1;
    let searchPath = path.resolve(programPath, './package.json');
    while (!fs.existsSync(searchPath) && searchPath !== '/package.json') {
        const packagePath = _.repeat('../', depth) + 'package.json';
        searchPath = path.resolve(programPath, packagePath);
        depth++;
    }

    return require(searchPath).version;
};

/**
 * General error handler
 * @param {string} message Error message
 * @param {Error} error Error object, that was catched
 * @param {object} program Program reference
 */
const errorHandler = (message, error, program) => {
    ui.print(ui.color.info('Usage:'));
    if (ui.getVerbosity() > 0) program.showHelp();
    ui.print('\n\n' + ui.color.warn('Error:'));
    if (debugMode) ui.print(ui.color.bold(error));
    else ui.print(ui.color.bold(message || error.message));
    process.exit(1);
};

global.cli = {
    config: config(programName),
    ui,
    api,
    _
};

program.run = () => {
    try {
        program.version(getProgramVersion())
            .option('v', {
                alias: 'verbose',
                description: 'Show more information',
                count: true,
                coerce: (verbose) => {
                    const v = verbose + 1;
                    ui.setVerbosity(v);
                    return v;
                }
            })
            .option('s', {
                alias: 'silent',
                description: 'No output',
                boolean: true,
                count: false,
                coerce: (silent) => {
                    ui.setVerbosity(0);
                    return silent;
                }
            })
            .option('d', {
                alias: 'debug',
                description: 'Debug mode (stacktraces, very verbose)',
                boolean: true,
                count: false,
                coerce: (debug) => {
                    debugMode = true;
                    ui.setVerbosity(2);
                    return debug;
                }
            })
            .alias('h', 'help')
            .alias('V', 'version')
            .help()
            .demandCommand()
            .recommendCommands()
            .completion()
            .strict()
            .wrap(program.terminalWidth())
            .env(programName.replace(/-/g, '_').toUpperCase())
            .updateStrings({
                'Commands:': ui.color.info('Commands:'),
                'Options:': ui.color.info('Options:')
            })
            .fail(errorHandler)
            .argv;
    }
    catch (error) {
        errorHandler(error.message, error, program);
    }
};

module.exports = program;