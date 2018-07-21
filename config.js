const _ = require('lodash');
const fs = require('fs-extra');

const globalConfig = require(process.env.HOME + '/.config/cli-tools.json');

/**
 * Get scoped configuration of program
 * @param {string} programName Name of program
 */
const config = (programName) => {
    const programConfig = globalConfig[programName] || {};

    /**
     * Read value from configuration by path
     * @param {string} path Path to value (eg.: foo.bar or foo.bar[2])
     * @param {*} defaultValue Default, if value is not configured
     */
    const get = (path, defaultValue = null) => _.get(programConfig, path, null) || defaultValue;

    /**
     * Set value in configuration by path
     * @param {string} path Path to value (eg.: foo.bar or foo.bar[2])
     * @param {*} value New value
     */
    const set = (path, value) => {
        _.set(programConfig, path, value);
        fs.writeJsonSync(
            process.env.HOME + '/.config/cli-tools.json',
            {
                ...globalConfig,
                [programName]: programConfig
            },
            {
                spaces: 2
            }
        );
    };

    return {
        get,
        set
    };
};

module.exports = config;