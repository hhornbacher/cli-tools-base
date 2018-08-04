# @clitools/base

Base module for writing advanced shell scripts with Node.js

## Features

* User configuration file management
* Access to system key management for secure storage of credentials (using: [keytar](https://github.com/atom/node-keytar))
* Error handling
* Debug mode, different verbosity levels
* Silent mode
* Bash completion script generation (using: [Yargs](https://github.com/yargs/yargs))
* CLI argument parsing (using: [Yargs](https://github.com/yargs/yargs))
* Consistent, formatted cli text output (using: [Chalk](https://github.com/chalk/chalk), [columnify](https://github.com/timoxley/columnify), [cli-progress](https://github.com/AndiDittrich/Node.CLI-Progress))

## Requirements

* `libsecret` is a dependency of [keytar](https://github.com/atom/node-keytar)
  * Debian/Ubuntu: `sudo apt-get install libsecret-1-dev`
  * Red Hat-based: `sudo yum install libsecret-devel`
  * Arch Linux: `sudo pacman -S libsecret`

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