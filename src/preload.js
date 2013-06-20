// Preloading using PreloadJS ( https://github.com/CreateJS/PreloadJS/ )
function Preload(game, center) {
  var self = this;
  var allDefs;

  var src;

  function addPath(def) {
    var path = src.match(/.*\//);
    path = path ? path[0] : '';
    path += def;
    if (!path.match(/\.js(on)?$/i)) path += '.json';
    return path;
  }

  function loadDefs(defPaths, cb) {
    defPaths = _.flatten([defPaths]);

    var queue = new createjs.LoadQueue();
    var defs = [];

    queue.addEventListener('fileload', function(e) {
      var result = e.result;
      src = e.item.src;

      if (result instanceof Error) {
        console.log('Unable to parse', src);
        throw result;
      }

      defs.push(result);
      allDefs.push(result);
    });

    queue.addEventListener('complete', function() {
      var count = _.reduce(defs, function(memo, def) {
        return _.flatten([def.includes]).length + memo;
      }, 0);

      _.each(defs, function(def) {
        if (def.includes) {
          def.includes = _.map(def.includes, addPath);
          loadDefs(def.includes, cb);
        } else {
          count--;
          if (count === 0) cb();
        }
      });
    });

    queue.loadManifest(defPaths);
  }

  function loadAssets(root, cb) {
    var queue = new createjs.LoadQueue();

    var defsAndItems = _.compact(_.toArray(root.defs).concat(root.items));
    var manifest = [];
    center.assets = {};

    queue.addEventListener('fileload', function(e) {
      center.assets[e.item.id] = e.result;
      if (e.item.ext === 'js') document.body.appendChild(e.result);
    });

    queue.addEventListener('complete', cb);

    _.each(defsAndItems, function(defOrItem, name) {
      var code = defOrItem.code;
      if (code) code = code.match(/(.*) /);
      if (code) manifest.push(addPath(code[1]));

      _.each(defOrItem.graphics, function(graphic) {
        var img = graphic.image;
        if (img) manifest.push(img);
      });
    });
    queue.loadManifest(manifest);
  }

  self.init = function(defPaths, cb) {
    allDefs = [];
    loadDefs(defPaths, function() {
      var root = allDefs[0];
      _.each(allDefs.slice(1), function(def) {
        helpers.deepDefaults(root, def);
      });

      center.items = root.items;
      center.defs = root.defs;
      loadAssets(root, cb);
    });
  };
}
