/**
 * General error handler
 * @param {string} message Error message
 * @param {Error} error Error object, that was catched
 * @param {object} program Program reference
 */
global.cli.errorHandler = (message, error = null) => {
    if (message) {
        cli.ui.print(cli.ui.color.info('Usage:'));
        if (cli.verbosity > 0) cli.program.showHelp();
        cli.ui.print('\n\n' + cli.ui.color.warn('Error:'));
        cli.ui.print(cli.ui.color.bold(message));
    }
    else if (error) {
        cli.ui.print('\n\n' + cli.ui.color.warn('Error:'));
        if (!cli.debugMode) cli.ui.print(cli.ui.color.bold(error.message));
        else cli.ui.print(error);
    }
    else {
        cli.ui.print(new Error('Unkown error!'));
    }

    process.exit(1);
};

process.on('unhandledRejection', error => errorHandler(null, error));