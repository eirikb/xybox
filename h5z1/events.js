events = (function() {
    var self, listeners;

    self = {};
    listeners = {};

    self.on = function(name, priority, cb) {
        if (arguments.length === 2) {
            cb = priority;
            priority = 1;
        }

        if (!listeners[name]) listeners[name] = [];

        listeners[name].push({
            priority: priority,
            callback: cb
        });
        listeners[name].sort(function(a, b) {
            return a.priroity > b.priority;
        });
    };

    // TODO: Use call and slice arguments
    self.trigger = function(name, val1, val2) {
        var ret;
        _.each(listeners[name], function(listener) {
            var r;

            r = listener.callback(val1, val2);
            if (typeof r !== 'undefined') ret = r;
        });
        return ret;
    };

    return self;
})();

