var expect = require("chai").expect;
var command = require('../src/command.js');

describe('Command constructor', function () {

    describe('path marginal cases', function () {
        function testCase(p) {
            expect(function () {
                var sut = new command(p);
            }).to.throw('path cannot be empty');
        }

        it('should throw when called with no path', function () {
            testCase();
        });
        it('should throw when called with empty path', function () {
            testCase('');
        });
        it('should throw when called with non-string path', function () {
            testCase([]);
        });
    });

    describe('when called with single part', function () {
        var sut = new command('app');

        it('should have correct name', function () {
            expect(sut.name).to.equal('app');
        });
        it('should have correct path', function () {
            expect(sut.path).to.equal('app');
        });
        it('should have empty parent path', function () {
            expect(sut.parentPath).to.be.empty;
        });
        it('should have empty command set', function () {
            expect(sut.commands).to.be.empty;
        });
        it('should have empty help', function () {
            expect(sut.$help).to.be.empty;
        });
        it('should not be terminal', function () {
            expect(sut.$terminal).to.be.false;
        });
        it('should have empty controller', function () {
            expect(sut.$controller).to.be.false;
        });
    });

    describe('when called with two parts', function () {
        var sut = new command('app.test');

        it('should have correct name', function () {
            expect(sut.name).to.equal('test');
        });
        it('should have correct path', function () {
            expect(sut.path).to.equal('app.test');
        });
        it('should have correct parent path', function () {
            expect(sut.parentPath).to.equal('app');
        });
    });

    describe('when called with multiple parts', function () {
        var sut = new command('app.test.foo.bar');

        it('should have correct name', function () {
            expect(sut.name).to.equal('bar');
        });
        it('should have correct path', function () {
            expect(sut.path).to.equal('app.test.foo.bar');
        });
        it('should have correct parent path', function () {
            expect(sut.parentPath).to.equal('app.test.foo');
        });
    });
});
