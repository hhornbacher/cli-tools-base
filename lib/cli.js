// Modules
const program = require('yargs');
const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');

// Define global interface
global.cli = {
    program,
    programName: path.basename(process.argv[1]),
    debugMode: false,
    verbosity: 1,
    _,
    fs
};

// Load internal modules
require('./ui');
require('./error-handler');
require('./keystore');
require('./config');
require('./promises');
require('./request');
require('./api');

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

// Excecute CLI program
global.cli.run = () => {
    try {
        program.version(getProgramVersion())
            .option('v', {
                alias: 'verbose',
                description: 'Show more information',
                count: true,
                coerce: (verbose) => {
                    global.cli.verbosity += verbose;
                    return global.cli.verbosity;
                }
            })
            .option('s', {
                alias: 'silent',
                description: 'No output',
                boolean: true,
                count: false,
                coerce: (silent) => {
                    global.cli.verbosity = 0;
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
                    global.cli.verbosity = 2;
                    global.cli.debugMode = debugMode;
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
            .env(cli.programName.replace(/-/g, '_').toUpperCase())
            .updateStrings({
                'Commands:': cli.ui.color.info('Commands:'),
                'Options:': cli.ui.color.info('Options:')
            })
            .fail(cli.errorHandler)
            .argv;
    }
    catch (err) {
        cli.errorHandler(null, err, program);
    }
};