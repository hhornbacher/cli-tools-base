const keytar = require('keytar');

global.cli.keystore = {
    getPassword: (service, account) => keytar.getPassword([cli.programName, service].join('.'), account),
    setPassword: (service, account, password) => keytar.setPassword([cli.programName, service].join('.'), account, password),
    deletePassword: (service, account) => keytar.deletePassword([cli.programName, service].join('.'), account),
    findPassword: (service) => keytar.findPassword([cli.programName, service].join('.')),
    findCredentials: (service) => keytar.findCredentials([cli.programName, service].join('.'))
};