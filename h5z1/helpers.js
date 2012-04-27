helpers = (function() {
    var self;

    self = {};

    // Recursive defaults
    self.defaults = function(obj, def) {
        if (_.isObject(obj) && _.isObject(def)) {
            _.defaults(obj, def);
            _.each(obj, function(val, key) {
                self.defaults(val, def[key]);
            });
        }
    };

    return self;
})();

