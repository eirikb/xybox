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

    self.trigger = function(name, val) {
        _.each(listeners[name], function(listener) {
            listener.callback(val);
        });
    };

    return self;
})();

