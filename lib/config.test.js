const expect = require('chai').expect;
const _ = require('lodash');
const fs = require('fs-extra');

describe('@clitools/base cli.config', () => {

    before(() => {
        global.cli = {
            programName: 'cli-base-test',
            _,
            fs
        };
        require('./config');
        cli.config.set('tests.get', 'SUCCESS');
        cli.config.set('tests.delete', 'FAIL');
    });

    after(() => {
        cli.config.delete('tests');
        delete global.cli;
    });

    describe('get', () => {
        describe('not existing path', () => {
            let result;
            beforeEach(() => {
                result = cli.config.get('tests.unkown');
            });


            it('returns null', () => {
                expect(result).to.equal(null);
            });
        });
        describe('not existing path with defaultValue', () => {
            let result;
            beforeEach(() => {
                result = cli.config.get('tests.unkown2', 'TEST_VALUE');
            });


            it('returns defaultValue', () => {
                expect(result).to.equal('TEST_VALUE');
            });
        });
        describe('existing path', () => {
            let result;
            beforeEach(() => {
                result = cli.config.get('tests.get');
            });


            it('returns correct value', () => {
                expect(result).to.equal('SUCCESS');
            });
        });
    });
    describe('set', () => {
        describe('not existing path', () => {
            beforeEach(() => {
                cli.config.set('tests.set', 'SUCCESS');
            });

            it('returns null', () => {
                const value = cli.config.get('tests.set');
                expect(value).to.equal('SUCCESS');
            });
        });
        describe('existing path', () => {
            beforeEach(() => {
                cli.config.set('tests.set', 'SUCCESS123');
            });

            it('returns null', () => {
                const value = cli.config.get('tests.set');
                expect(value).to.equal('SUCCESS123');
            });
        });
    });
    describe('delete', () => {
        describe('existing path', () => {
            beforeEach(() => {
                cli.config.delete('tests.delete');
            });

            it('deletes config', () => {
                const value = cli.config.get('tests.delete');
                expect(value).to.equal(null);
            });
        });
    });
});