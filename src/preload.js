// Preloading using PreloadJS ( https://github.com/CreateJS/PreloadJS/ )
preload = (function() {
    var self = {};
    var total = 0;
    var count = 0;

    self.recursiveLoad = function(manifest, cb) {
        total = 0;
        count = 0;
        result = {};
        allAssets = [];
        load(manifest, cb);
    };

    function load(manifest, cb) {
        var assets = [];
        var loader = new PreloadJS();

        total += manifest.length;

        loader.onFileLoad = function(event) {
            assets.push(event);
        };

        loader.onComplete = function() {
            var manifest = [];
            count += assets.length;

            _.each(assets, function(a) {
                allAssets.push(a);

                switch (a.type) {

                case PreloadJS.JAVASCRIPT:
                    document.body.appendChild(a.result);
                    break;

                case PreloadJS.JSON:
                    try {
                        a = JSON.parse(a.result);
                        _.each(a.preload, function(m) {
                            manifest.push(m);
                        });

                        // Remove preload and combine/extend result with a.result
                        delete a.preload;
                        helpers.deepDefaults(result, a);
                    } catch (e) {
                        console.error('Unable to parse ' + a.src);
                        throw e;
                    }
                    break;
                }
            });

            if (manifest.length > 0) load(manifest, cb);

            cb(count, total, result, allAssets);
        };

        loader.loadManifest(manifest);
    }

    return self;
})();
