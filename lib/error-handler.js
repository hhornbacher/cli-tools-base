/**
 * General error handler
 * @param {string} message Error message
 * @param {Error} error Error object, that was catched
 * @param {object} program Program reference
 */
global.cli.errorHandler = (message, error = null) => {
    if (cli.verbosity === 0) return process.exit(1);

    if (message) {
        cli.program.showHelp();
        cli.ui.print(cli.ui.color.info('Usage:'));
        cli.ui.print('\n\n' + cli.ui.color.warn('Error:'));
        if (cli.debugMode && error) cli.ui.print(error);
        else cli.ui.print(cli.ui.color.bold(message));
    }
    else if (error) {
        cli.ui.print('\n\n' + cli.ui.color.warn('Error:'));
        if (!cli.debugMode) cli.ui.print(cli.ui.color.bold(error.message));
        else cli.ui.print(error);
    }
    else {
        const err = new Error('Unkown error!');

        cli.ui.print(err.toString().replace('Error:', cli.ui.color.warn('Error:\n')));
    }

    process.exit(1);
};

typeof global.it !== 'function' && process.on('unhandledRejection', error => cli.errorHandler(null, error));