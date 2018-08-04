const configPath = process.env.HOME + '/.config/cli-tools.json';

if (!cli.fs.existsSync(configPath)) cli.fs.writeJsonSync(configPath, {});

const globalConfig = cli.fs.readJsonSync(configPath);

global.cli.config = {};

/**
 * Read value from configuration by path
 * @param {string} path Path to value (eg.: foo.bar or foo.bar[2])
 * @param {*} defaultValue Default, if value is not configured
 */
global.cli.config.get = (path, defaultValue = null) => cli._.get(globalConfig, [cli.programName, path].join('.'), defaultValue);

/**
 * Set value in configuration by path
 * @param {string} path Path to value (eg.: foo.bar or foo.bar[2])
 * @param {*} value New value
 */
global.cli.config.set = (path, value) => {
    cli._.set(globalConfig, [cli.programName, path].join('.'), value);
    cli.fs.writeJsonSync(
        configPath,
        globalConfig,
        {
            spaces: 2
        }
    );
};

/**
 * Delete value in configuration by path
 * @param {string} path Path to value (eg.: foo.bar or foo.bar[2])
 */
global.cli.config.delete = (path) => {
    cli._.unset(globalConfig, [cli.programName, path].join('.'));
    cli.fs.writeJsonSync(
        configPath,
        globalConfig,
        {
            spaces: 2
        }
    );
};