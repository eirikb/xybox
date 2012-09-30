game = (function() {
    var self;

    self = {};
    self.fps = 40;
    self.objects = [];
    self.actives = [];

    // Keyboard input using kibo ( https://github.com/marquete/kibo )
    self.keys = new Kibo();

    self.createObject = function(object) {
        var def = self.defs[object.def];
        if (def) helpers.deepDefaults(object, def);
        if (object.name) self[object.name] = object;
        self.objects.push(object);
        if (!(def.body && def.body.isStatic)) self.actives.push(object);
        events.trigger('objectCreate', object);
        return object;
    };

    self.destroyObject = function(object) {
        events.trigger('objectDestroy', object);
        self.objects = _.without(self.objects, object);
    };

    self.overlapping = function(object) {
        var overlaps = physics.overlapping(object.body);
        return _.chain(overlaps).compact().map(function(fixture) {
            return fixture.object;
        }).value();
    }

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

            self.defs = result.defs;

            _.each(result.objects, function(object) {
                self.createObject(object);
            });

            Ticker.setFPS(self.fps);
            Ticker.addListener(function() {
                events.trigger('tick');
            });

            events.trigger('ready');

            cb && cb();
        });
    }

    return self;
})();
