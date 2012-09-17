game = (function() {
    var self;

    self = {};
    self.fps = 40;
    self.objects = [];

    // Keyboard input using kibo ( https://github.com/marquete/kibo )
    self.keys = new Kibo();

    self.createObject = function(object) {
        var objectdef = self.objectdefs[object.objectdef];
        if (objectdef) helpers.deepDefaults(object, objectdef);
        if (object.name) self[object.name] = object;
        self.objects.push(object);
        events.trigger('objectCreate', object);
        return object;
    };

    self.destroyObject = function(object) {
        events.trigger('objectDestroy', object);
        self.objects = _.without(self.objects, object);
    };

    self.init = function(name, cb) {
        var manifest;

        if (!name.match(/\.json$/i)) name += '.json';

        manifest = [name, 'meta.json'];

        preload.recursiveLoad(manifest, function(result, assets) {
            // Global meta
            meta = result.meta;

            events.trigger('onload');

            self.assets = assets;
            _.each(assets, function(asset) {
                assets[asset.id] = asset.result;
            });

            self.objectdefs = result.objectdefs;

            _.each(result.objects, function(object) {
                self.createObject(object);
            });

            Ticker.setFPS(self.fps);
            Ticker.addListener(function() {
                events.trigger('tick');
            });

            events.trigger('ready');

            cb();
        });
    }

    return self;
})();

