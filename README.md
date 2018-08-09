# @clitools/base

Base module for writing advanced shell scripts with Node.js.

At it's core it uses [Yargs](https://github.com/yargs/yargs) for option and parameter parsing, so it's a good idea to look at that documentation first.

## Features

The target is to have a base module for writing Linux shell scripts, with APIs for most common CLI tasks, like:

* Parsing command line optionsa and arguments ([cli.js](lib/cli.js), _using:_ [Yargs](https://github.com/yargs/yargs))
* Bash completion script generation ([cli.js](lib/cli.js), _using:_ [Yargs](https://github.com/yargs/yargs))
* User configuration file management ([config.js](lib/config.js))
* Access to system key management for secure storage of credentials (Plugin: [@clitools/keystore](https://github.com/hhornbacher/cli-tools-keystore.git))
* Error handling ([error-handler.js](lib/error-handler.js))
* Debug mode, different verbosity levels ([error-handler.js](lib/error-handler.js), [ui.js](lib/ui.js))
* Silent mode ([ui.js](lib/ui.js))
* Integrates [request](https://github.com/request/request) for API calls, crawling, downloading, etc. ([request.js](lib/request.js))
* Consistent, formatted cli text output ([ui.js](lib/ui.js), _using:_ [Chalk](https://github.com/chalk/chalk), [columnify](https://github.com/timoxley/columnify), [cli-progress](https://github.com/AndiDittrich/Node.CLI-Progress))

## System requirements

Only tested with Linux (Ubuntu/Mint), Mac OS maybe also works, Windows is not supported.

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

**example-tool:**

```javascript
#!/usr/bin/env node

require('./lib/cli');


cli.program
    .command('test <param>', 'Example command', (program) => {
        program
            .positional('param', {
                description: 'Test parameter'
            });
    }, ({ param }) => {
        cli.ui.startProgress('Test...');
        return cli.promises.throttle([
            () => Promise.resolve(param),
            () => Promise.resolve('A'),
            () => Promise.resolve('B'),
            () => Promise.resolve('C'),
            () => Promise.resolve('D'),
            () => Promise.resolve('E'),
            () => Promise.resolve('F'),
            () => Promise.resolve('G'),
            () => Promise.resolve('H'),
            () => Promise.resolve('I'),
            () => Promise.resolve('X')
        ], 1000, (p) => {
            cli.ui.updateProgress(p);
        })
            .then((result) => {
                cli.ui.stopProgress();
                cli.ui.print(result);
            });
    });

cli.run();
```

**Output:**

```bash
$ ./example-tool
Usage:
example-tool <command>

Commands:
  example-tool test <param>  Example command
  example-tool completion    generate bash completion script

Options:
  -v, --verbose  Show more information                      [count]
  -s, --silent   No output                                  [boolean]
  -d, --debug    Debug mode (stacktraces, very verbose)     [boolean]
  -h, --help     Show help                                  [boolean]
  -V, --version  Show version number                        [boolean]


Error:
Not enough non-option arguments: got 0, need at least 1
```

## [Changelog](CHANGELOG.md)