game = (function() {
    var self;

    self = {};
    self.fps = 40;
    self.world = trolley.init();

    //self.world.SetGravity(new b2Vec2(0, -20));
    // Keyboard input using kibo ( https://github.com/marquete/kibo )
    self.keys = new Kibo();

    self.createObject = function(object) {
        var objectdef = self.objectdefs[object.objectdef];
        if (objectdef) helpers.deepDefaults(object, objectdef);
        if (object.name) self[object.name] = object;
        events.trigger('objectCreate', object);
        return object;
    };

    function loadLevel(number, cb) {
        var manifest;

        manifest = ['levels/level-' + number + '.json'];

        preload.recursiveLoad(manifest, function(result, assets) {
            events.trigger('onload');

            self.assets = assets;
            _.each(assets, function(asset) {
                assets[asset.id] = asset.result;
            });

            self.objectdefs = result.objectdefs;

            self.objects = _.map(result.objects, function(object) {
                return self.createObject(object);
            });

            Ticker.setFPS(self.fps);
            Ticker.addListener(function() {
                events.trigger('tick');
            });
        });

        cb();
    }

    window.onload = function() {
        var loader, assets, spinner;

        spinner = new Spinner({
            top: 150,
            left: 300
        });

        spinner.spin(document.body);

        loadLevel(1, function() {
            spinner.stop();
        });
    };

    return self;
})();

