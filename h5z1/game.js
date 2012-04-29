game = (function() {
    var self;

    self = {};
    self.fps = 40;
    self.world = trolley.init();

    // Keyboard input using kibo ( https://github.com/marquete/kibo )
    self.keys = new Kibo();

    function loadLevel(number, cb) {
        var manifest;

        manifest = ['levels/level-' + number + '.json'];

        preload.recursiveLoad(manifest, function(result, assets) {
            self.assets = assets;

            self.objects = _.map(result.objects, function(object) {
                var objectdef = result.objectdefs[object.objectdef];
                if (objectdef) helpers.deepDefaults(object, objectdef);
                if (object.name) self[object.name] = object;
                return object;
            });

            _.each(assets, function(asset) {
                assets[asset.id] = asset.result;
            });

            events.trigger('onload');

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

