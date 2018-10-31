var DEFAULT = 'default';

var TYPE = {
    UNDEFINED: '[object Undefined]',
    ARRAY: '[object Array]'
};

var _shift = Array.prototype.shift,
    _unshift = Array.prototype.unshift,
    _toString = Object.prototype.toString,
    namespaceCache = getCleanObj();


function getCleanObj() {
    return Onject.create(null);
}

function _each(ary, fn) {
    var ret,
        item,
        i = 0,
        len = ary.length;

    for (; i < len; i++) {
        item = ary[i];
        ret = fn.call(item, i, item)
    }
    return ret;
}

function _listen(key, fn, cache) {
    (!cache[key]) && (cache[key] = []);
    cache[key].push(fn);
}

function _remove(key, cache, fn) {
    if (!cache[key]) {
        return;
    }

    if (fn) {
        for (var i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
                cache[key].splice(i, 1);
            }
        }
    } else {
        cache[key] = [];
    }
}

function _trigger() {
    var cache = _shift.call(arguments),
        key = _shift.call(arguments),
        args = arguments,
        _shift = this,
        stack = cache[key];

    if (!stack || !stack.length) {
        return;
    }

    return _each(stack, function () {
        return this.apply(_self, args);
    })
}

function _create(namespace) {
    var message = namespace || DEFAULT;

    // 缓存事件空间
    var cache = getCleanObj(),
        offlineStack = getCleanObj(),
        ret = {
            listen: function (key, fn) {
                _listen(key, fn, cache);

                if (offlineStack[key]) {
                    _each(offlineStack[key], function () {
                        this();
                    })
                }
                offlineStack[key] = null;
            },

            one: function (key, fn) {
                _remove(key, cache);
                this.listen(key, fn);
            },

            remove: function (key, fn) {
                _remove(key, cache, fn);
            },

            trigger: function () {
                var fn, args, key,
                    _self = this;

                _unshift.call(arguments, cache);
                args = arguments;
                key = args[1];

                fn = function () {
                    return _trigger.apply(_self, args);
                }

                if (TYPE.UNDEFINED === _toString.call(offlineStack[key])) {
                    offlineStack[key] = [];
                    return offlineStack[key].push(fn);
                }
                else if (TYPE.ARRAY === _toString.call(offlineStack[key])) {
                    return offlineStack[key].push(fn);
                }

                return fn();
            }
        };
    return namespaceCache[namespace] ?
        namespaceCache[namespace] :
        namespaceCache[namespace] = ret;
};

var message = {
    create: _create,

    one: function (key, fn) {
        var message = this.create();
        message.one(key, fn);
    },

    remove: function (key, fn) {
        var message = this.create();
        message.remove(key, fn);
    },

    listen: function (key, fn) {
        var message = this.create();
        message.listen(key, fn);
    },

    trigger: function () {
        var message = this.create();
        message.trigger.apply(this, arguments);
    }
};