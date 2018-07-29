# @clitools/base

Base module for writing advanced shell scripts with Node.js

## Features

* User configuration file management
* Error handling
* Debug mode, different verbosity levels
* Silent mode
* Bash completion script generation (using: [Yargs](https://github.com/yargs/yargs))
* CLI argument parsing (using: [Yargs](https://github.com/yargs/yargs))
* Consistent, formatted cli text output (using: [Chalk](https://github.com/chalk/chalk), [columnify](https://github.com/timoxley/columnify), [cli-progress](https://github.com/AndiDittrich/Node.CLI-Progress))

## Install

```bash
$ npm i --save @clitools/base
[...]
```

## Example

**example.js:**

```javascript
#!/usr/bin/env node

require('@clitools/base');

const {
    importOrders,
    listComponents
} = require('./lib/components');

cli.program
    .command('import <distributor>', 'Import orders to db', (program) => {
        program.positional('distributor', {
            choices: ['foo', 'bar']
        });
    }, ({ distributor }) => {
        return importOrders(distributor)
            .then(cli.ui.print);
    })
    .command('ls', 'List components', cli._.noop, (yargs) => {
        cli.ui.startProgress('Retrieving components from db...');
        return listComponents()
            .then((x) => {
                cli.ui.updateProgress(50);
                return x;
            })
            .then((x) => {
                cli.ui.stopProgress();
                return x;
            })
            .then(cli.ui.print);
    });

cli.run();
```

**Output:**

```bash
$ ./example.js
Usage:
example.js <command>

Commands:
  example.js import <distributor>  Import orders to db
  example.js ls                    List components
  example.js completion            generate bash completion script

Options:
  -v, --verbose  Show more information                                                                                                                                                         [count]
  -s, --silent   No output                                                                                                                                                                   [boolean]
  -d, --debug    Debug mode (stacktraces, very verbose)                                                                                                                                      [boolean]
  -h, --help     Show help                                                                                                                                                                   [boolean]
  -V, --version  Show version number                                                                                                                                                         [boolean]


Error:
Not enough non-option arguments: got 0, need at least 1
```

## [Changelog](CHANGELOG.md)