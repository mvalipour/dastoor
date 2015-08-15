function Command(path) {
    if(!/^[\w\-]+(\.[\w\-]+)*$/g.test(path)) throw 'module path is invalid: ' + path;

    var p = path.split('.');
    var name = p[p.length - 1];
    var parentPath = p.splice(0, p.length - 1).join('.');

    this.parentPath = parentPath;
    this.name = name;
    this.path = (parentPath ? parentPath + '.' : '') + name;
    this.commands = [];
    this.$help = {};
    this.$terminal = false;
    this.$controller = false;
}

Command.prototype._getChild = function (name) {
    return this.commands.filter(function (c) {
        return c.name === name || c.$alias === name;
    })[0];
};

Command.prototype.configure = function (config) {

    if(config) {

        if(config.terminal !== undefined) {
            this.$terminal = !!config.terminal;
        }

        if(config.help !== undefined) {
            this.help(config.help);
        }

        if(config.controller !== undefined) {
            this.controller(config.controller);
        }

        if(config.alias !== undefined) {
            this.$alias = config.alias;
        }
    }

    return this;
};

Command.prototype.help = function (i) {
    var options = typeof i === 'string' ?
                  { description: i } :
                  i;

    this.$help = options;
    return this;
};

Command.prototype.controller = function (controller) {
    this.$controller = controller;
    return this;
};

module.exports = Command;
