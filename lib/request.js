const rp = require('request-promise-native');
global.cli.request = rp.defaults({ jar: true });
