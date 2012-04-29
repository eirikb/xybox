// Preloading using PreloadJS ( https://github.com/CreateJS/PreloadJS/ )
preload = (function() {
    var self, total, result, allAssets;

    self = {};

    function load(manifest, cb) {
        var loader, assets;

        total += manifest.length;

        assets = [];

        loader = new PreloadJS();

        loader.onFileLoad = function(event) {
            assets.push(event);
        };

        loader.onComplete = function() {
            manifest = [];
            total -= assets.length;

            _.each(assets, function(a) {
                allAssets.push(a);

                switch (a.type) {

                case PreloadJS.JAVASCRIPT:
                    document.body.appendChild(a.result);
                    break;

                case PreloadJS.JSON:
                    a = JSON.parse(a.result);
                    _.each(a.preload, function(m) {
                        manifest.push(m);
                    });

                    // Remove preload and combine/extend result with a.result
                    delete a.preload;
                    helpers.deepDefaults(result, a);
                    break;
                }
            });

            if (manifest.length > 0) load(manifest, cb);

            if (total === 0) {
                cb(result, allAssets);
            }
        };

        loader.loadManifest(manifest);
    }

    self.recursiveLoad = function(manifest, cb) {
        total = 0;
        result = {};
        allAssets = [];
        load(manifest, cb);
    };

    return self;
})();

