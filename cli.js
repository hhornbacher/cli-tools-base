// Modules
const program = require('yargs');
const path = require('path');

// Internal modules
const config = require('./config');
const ui = require('./ui');

/**
 * General error handler
 * @param {string} message Error message
 * @param {Error} error Error object, that was catched
 * @param {object} program Program reference
 */
const errorHandler = (message, error, program) => {
    ui.print(ui.color.info('Usage:'));
    program.showHelp();
    ui.print('\n\n' + ui.color.warn('Error:'));
    ui.print(ui.color.bold(message || error.message));
    process.exit(1);
};

/**
 * Define a JS-CLI program
 * @param {string} version Program version
 * @param {function} generate Callback in which the program has to be defined
 */
const defineProgram = (version, generate) => {
    const programName = path.basename(process.argv[1]);

    program
        .version(version)
        .option('v', {
            alias: 'verbose',
            count: true
        })
        .alias('h', 'help')
        .env(programName.replace(/-/g, '_').toUpperCase())
        .strict()
        .demandCommand()
        .recommendCommands()
        .completion()
        .wrap(program.terminalWidth())
        .updateStrings({
            'Commands:': ui.color.info('Commands:'),
            'Options:': ui.color.info('Options:')
        })
        .fail(errorHandler);

    generate({
        program,
        config: config(programName),
        env: process.env,
        ui
    });

    try {
        program.argv;
    }
    catch (error) {
        errorHandler(error.message, error, program);
    }
};

module.exports = defineProgram;