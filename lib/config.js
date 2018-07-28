const configPath = process.env.HOME + '/.config/cli-tools.json';

if (!cli.fs.existsSync(configPath)) cli.fs.writeJsonSync(configPath, {});

const globalConfig = require(configPath);

const programConfig = globalConfig[cli.programName] || {};

global.cli.config = {};

/**
 * Read value from configuration by path
 * @param {string} path Path to value (eg.: foo.bar or foo.bar[2])
 * @param {*} defaultValue Default, if value is not configured
 */
global.cli.config.get = (path, defaultValue = null) => cli._.get(programConfig, path, null) || defaultValue;

/**
 * Set value in configuration by path
 * @param {string} path Path to value (eg.: foo.bar or foo.bar[2])
 * @param {*} value New value
 */
global.cli.config.set = (path, value) => {
    cli._.set(programConfig, path, value);
    cli.fs.writeJsonSync(
        configPath,
        {
            ...globalConfig,
            [cli.programName]: programConfig
        },
        {
            spaces: 2
        }
    );
};