// Preloading using PreloadJS ( https://github.com/CreateJS/PreloadJS/ )
preload = (function() {
    var self = {};
    var total = 0;
    var cache = [];
    var result = {};
    var allAssets = [];
    var count = 0;

    self.recursiveLoad = function(manifest, cb) {
        total = 0;
        result = {};
        allAssets = [];
        load(manifest, cb);
    };

    // http://stackoverflow.com/questions/756382/bookmarklet-wait-until-javascript-is-loaded

    function loadScript(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = url;

        var done = false;
        if (callback) {
            script.onload = script.onreadystatechange = function() {
                if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
                    done = true;

                    callback();

                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                    head.removeChild(script);
                }
            };
        }

        head.appendChild(script);
    }

    function load(root, manifest, cb) {
        if (arguments.length === 2) {
            cb = manifest;
            manifest = root;
            root = '';
        }
        manifest = _.without(manifest, cache);
        cache = cache.concat(manifest);
        manifest = _.map(manifest, function(m) {
            if (!m.id) {
                m = {
                    id: m,
                    src: m
                };
            }
            m.src = root + m.src;
            return m;
        });
        var assets = [];
        var loader = new createjs.PreloadJS();

        total += manifest.length;

        loader.onFileLoad = function(event) {
            assets.push(event);
        };

        loader.onComplete = function() {
            _.each(assets, function(a) {
                allAssets.push(a);

                switch (a.type) {
                case createjs.PreloadJS.JAVASCRIPT:
                    loadScript(a.result.src, function() {
                        cb(++count, total, result, allAssets);
                    });
                    break;
                case createjs.PreloadJS.JSON:
                    try {
                        var r = a.src.match(/.*\//);
                        r = r ? r[0] : '';
                        a = JSON.parse(a.result);
                        _.each(a.preload, function(m) {
                            if (_.contains(cache, m)) return;
                            load(r, [m], cb);
                        });

                        // Remove preload and combine/extend result with a.result
                        delete a.preload;
                        helpers.deepDefaults(result, a);
                    } catch (e) {
                        console.error('Unable to parse ' + a.src);
                        throw e;
                    }
                    cb(++count, total, result, allAssets);

                    break;
                default:
                    cb(++count, total, result, allAssets);
                    break;
                }
            });
        };

        loader.loadManifest(manifest);
    }

    return self;
})();