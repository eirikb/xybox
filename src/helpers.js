helpers = {
    // Recursive defaults
    deepDefaults: function(obj, def) {
        if (_.isObject(obj) && _.isObject(def)) {
            _.defaults(obj, def);
            _.each(obj, function(val, key) {
                helpers.deepDefaults(val, def[key]);
            });
        }
    }

};

