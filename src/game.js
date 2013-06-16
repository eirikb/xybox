game = (function() {
  var self;

  self = {};
  self.fps = 30;
  self.objects = [];
  self.actives = [];
  self.defs = {};
  self.assets = {};
  self.version = '1.0.1';

  // Keyboard input using kibo ( https://github.com/marquete/kibo )
  self.keys = new Kibo();

  self.createObject = function(object) {
    var def = self.defs[object.def];
    if (def) helpers.deepDefaults(object, def);
    if (object.name) self[object.name] = object;
    self.objects.push(object);
    if (def && def.body && !def.body.isStatic) self.actives.push(object);
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
  };

  self.load = function(name, cb, complete) {
    var manifest;

    if (!name.match(/\.json$/i)) name += '.json';

    manifest = [name, 'meta.json'];

    self.ready = false;
    preload.recursiveLoad(manifest, function(count, total, result, assets) {
      if (count < total) return;


      _.each(self.objects, function(object) {
        self.destroyObject(object);
      });

      // Global meta
      meta = result.meta;

      events.trigger('onload');

      _.each(assets, function(asset) {
        self.assets[asset.id] = asset.result;
      });

      _.extend(self.defs, result.defs);

      _.each(result.objects, function(object) {
        self.createObject(object);
      });

      if (cb) cb(count, total, result, assets);
      self.ready = true;
      events.trigger('ready');
      name = name.replace(/^\S*\//, '').replace(/\.json$/i, '');
      events.trigger('ready-' + name);
    });
  };

  self.start = function() {
    if (meta.fps) self.fps = meta.fps;

    createjs.Ticker.removeAllListeners();
    createjs.Ticker.setFPS(self.fps);
    createjs.Ticker.addListener(function() {
      events.trigger('tick');
    });
  };

  return self;
})();
