var expect = require("chai").expect;
var command = require('../src/command.js');

describe('Command:_constructor()', function () {

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
        it('should have empty alias', function () {
            expect(sut.$alias).to.be.empty;
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

describe('Command:configure()', function () {

    it('when pass terminal, should set terminal', function () {
        var sut = new command('app');
        sut.configure({ terminal: true });
        expect(sut.$terminal).to.be.true;
    });

    it('when pass alias, should set alias', function () {
        var sut = new command('app');
        sut.configure({ alias: 'test' });
        expect(sut.$alias).to.equal('test');
    });

    it('when pass controller, should set controller', function () {
        var sut = new command('app');
        var fn = function () {};
        sut.configure({ controller: fn });
        expect(sut.$controller).to.equal(fn);
    });

    it('when pass help, should set help', function () {
        var sut = new command('app');
        var h = { some: 'help' };
        sut.configure({ help: h });
        expect(sut.$help).to.equal(h);
    });

    it('should return command', function () {
        var sut = new command('app');
        var res = sut.configure();
        expect(res).to.equal(sut);
    });

    describe('when pass alias and controller (multiple)', function () {
        var sut = new command('app');
        var fn = function () {};
        sut.configure({ alias: 'test', controller: fn });

        it('should set alias', function () {
            expect(sut.$alias).to.equal('test');
        });
        it('should set controller', function () {
            expect(sut.$controller).to.equal(fn);
        });
    });
});

describe('Command:help()', function () {
    describe('when pass a string', function () {
        var sut = new command('app');
        var res = sut.help('some help');

        it('help should be an object', function () {
            expect(sut.$help).to.be.an('object');
        });

        it('help should have correct description', function () {
            expect(sut.$help.description).to.equal('some help');
        });

        it('should return command', function () {
            expect(res).to.equal(sut);
        });
    });

    it('should set help, when pass an object', function () {
        var sut = new command('app');
        var h = { some: 'help' };
        sut.help(h);

        expect(sut.$help).to.equal(h);
    });
});

describe('Command:controller()', function () {
    describe('throws when non-function is passed', function () {
        var sut = new command('app');
        function testCase(v) {
            expect(function () {
                sut.controller(v);
            }).to.throw('controller must be a function');
        }

        it('test-case: nothing', function () { testCase(); });
        it('test-case: string', function () { testCase('something'); });
        it('test-case: array', function () { testCase([]); });
    });


    it('when pass function, should set controller', function () {
        var sut = new command('app');
        var fn = function () {};
        sut.controller(fn);
        expect(sut.$controller).to.equal(fn);
    });
});

describe('Command:_getChild()', function () {
    var sut = new command('app');
    var c1 = new command('app.test1'),
        c2 = new command('app.test2'),
        c3 = (new command('app.test3')).configure({ alias: 't3'}),
        c4 = new command('app.test4'),
        c5 = new command('app.test5');

    sut.commands = [c1, c2, c3, c4, c5];

    it('should return correct sub-command when name match', function () {
        var res = sut._getChild('test4');
        expect(res).to.equal(c4);
    });

    it('should return correct sub-command when alias match', function () {
        var res = sut._getChild('t3');
        expect(res).to.equal(c3);
    });

    it('should return null when nothing match', function () {
        var res = sut._getChild('none');
        expect(res).to.be.empty;
    });
});
