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

    self.manifest = function(src, id) {
        if (id) {
            manifest.push({
                src: src,
                id: id
            });
        } else {
            manifest.push(src);
        }
    };
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

        loader = new PreloadJS();
        assets = [];
        spinner = new Spinner({
            top: 150,
            left: 300
        });

        spinner.spin(document.body);
        loader.onFileLoad = function(event) {
            assets.push(event);
        };

        loader.onComplete = function() {
            spinner.stop();

            _.chain(assets).filter(function(a) {
                return a.src.match(/json$/);
            }).each(function(a) {
                a = JSON.parse(a.result);
                _.extend(self.types, a.types);
            });

            _.each(assets, function(asset) {
                assets[asset.id] = asset.result;
            });

            _.each(onloads, function(onload) {
                onload(assets);
            });

            Ticker.setFPS(game.fps);
            Ticker.addListener(function() {
                _.each(ticks, function(tick) {
                    tick();
                });
            });
        };

        loader.loadManifest(manifest);
    };

    return self;
})();

