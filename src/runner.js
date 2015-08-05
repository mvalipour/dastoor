var minimist = require('minimist');
var extend = require('extend');
var utils = require('./_utils');

var defaultOptions = {
    log: console.log,
    errorLog: console.log,
    helpLog: console.log,
    shortHelpKey: 'h',
    longHelpKey: 'help',
    helpKeyDescription: 'show this help'
};

function Runner(options) {
    this.options = extend({}, defaultOptions, options);
    this.onNodeStartingRegistrar = [];
}

Runner.prototype._isHelpKey = function(e) {
    return e === ('--' + this.options.longHelpKey) ||
           e === ('-' + this.options.shortHelpKey);
};

Runner.prototype._isKey = function(e) {
    return e[0] === '-';
};

Runner.prototype.run = function (node, args) {
    var e;

    while(args.length){
        e = args[0];
        if(this._isKey(e)) break;

        args = args.splice(1);
        node = node._getChild(e);
        if(!node) break;
        if(node.$terminal) break;
    }

    if(node){
        var hasHelp = args.filter(this._isHelpKey.bind(this)).length > 0;
        var controller = node.$controller;

        if(hasHelp || !controller) return this.renderHelp(node);

        this._onNodeStarting(node);

        var inputArgs = minimist(args);
        extend(inputArgs, this.options.localArgs || {});
        var result = controller.call(node, inputArgs);
        if(result === 'h') return this.renderHelp(node);
    }
    else{
        this.options.errorLog('command `'+e+'` not found');
    }
};

Runner.prototype.onNodeStarting = function (f) {
    this.onNodeStartingRegistrar.push(f);
};

Runner.prototype._onNodeStarting = function (node, path){
    this.onNodeStartingRegistrar.forEach(function (f) {
        f.call(node, node, path);
    });
};

Runner.prototype.renderHelp = function (node) {
    var helpOption = {
        name: '-'+this.options.shortHelpKey+', --' + this.options.longHelpKey,
        description: this.options.helpKeyDescription
    };

    var log = this.options.helpLog;

    var h = node.$help;
    var sub = node.commands;
    var usage = h && h.usage;
    var options = ((h && h.options) || []).concat(helpOption);
    log();
    if(h && h.description){
        log('>   ' + h.description);
        log();
    }

    if(options){
        log('    options:');
        options.forEach(function (o) {
            log('      ' + utils.pad(o.name, 20), o.description);
        });
        log();
    }

    if(usage || sub.length > 0){
        log('    usage:');
        if(usage){
            usage.forEach(function (u) {
                log('      ' + u);
            });
        }

        if(sub.length > 0){
            sub.forEach(function (subcmd) {
                var p = subcmd.path.replace(/\./g, ' ');
                var h = subcmd.$help || {};
                log('      '+utils.pad(p, 26), h.description || '');
            });
            log();
        }
    }
};

module.exports = Runner;
