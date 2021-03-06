# Changelog

## 2.3.1

* Remove default env settings

## 2.3.0

* Change the way plugins are loaded (have to be required in the script now)

## 2.2.0

* Move `keystore` to own module

## 2.1.0

* Improve debug output
  * Add `cli.ui.printError`
  * Add `cli.ui.printDebug`
* Replace own request library with `request` and `request-promise-native`
* Remove `api.js`

## 2.0.0

* Add promise helper module
* Add HTTP(S) request module
* Implement ui progress functions
* Implement unit tests
* Integrate linter

## 1.6.1

* Move sorce files to `lib` directory

## 1.6.0

* Improve API module
* Improve UI module
* Improve configuration module
* Improve `global cli` interface

## 1.5.1

* Turn `program.lib` into `global cli`

## 1.4.0

* Improve debug mode

## 1.3.0

* Rename from `@cli-tools/cli` to `@clitools/base`

## 1.2.0

* Get version from caller script's `package.json`

## 1.1.1

* Add missing `api.js`

## 1.1.0

* Implement verbosity, silent and debug output options
* Create config file if it doesn't exist

## 1.0.0

* Split everything up into own modules
* Moved to own repo from my dot files / bash scripts repo