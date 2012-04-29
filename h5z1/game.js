game = (function() {
    var self, manifest, onloads, ticks;

    self = {};
    self.fps = 40;
    self.world = trolley.init();
    // Keyboard input using kibo ( https://github.com/marquete/kibo )
    self.keys = new Kibo();
    self.objects = [];
    self.types = {};

    manifest = [];
    onloads = [];
    ticks = [];

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

            _.each(onloads, function(onload) {
                onload();
            });

            Ticker.setFPS(self.fps);
            Ticker.addListener(function() {
                _.each(ticks, function(tick) {
                    tick();
                });
            });
        });

        cb();
    }

    self.preOnload = function(onload) {
        onloads.unshift(onload);
    };
    self.onload = function(onload) {
        onloads.push(onload);
    };
    self.preTick = function(tick) {
        ticks.unshift(tick);
    };
    self.tick = function(tick) {
        ticks.push(tick);
    };

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

