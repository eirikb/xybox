function Game() {
  var self = this;

  self.events = new Events(self);
  self.graphics = new Graphics(self);
  // Keyboard input using kibo ( https://github.com/marquete/kibo )
  self.keys = new Kibo();

  self.fps = 30;
  self.defs = {};
  self.assets = {};
  self.items = [];
  self.actives = [];
  self.version = '1.0.2';

  self.createItem = function(item) {
    var def;
    if (item.def) def = self.defs[item.def];
    if (def) helpers.deepDefaults(item, def);
    if (item.name) self[item.name] = item;
    self.items.push(item);
    if (def && def.body && !def.body.isStatic) self.actives.push(item);
    self.graphics.createItem(item);

    return item;
  };

  self.destroyItem = function(item) {
    self.items = _.without(self.items, item);
  };

  self.overlapping = function(item) {
    var overlaps = physics.overlapping(item.body);
    return _.chain(overlaps).compact().map(function(fixture) {
      return fixture.item;
    }).value();
  };

  self.init = function(canvasId, defs) {
    self.canvas = document.getElementById(canvasId);
    var defqueue = new createjs.LoadQueue();
    var assetqueue = new createjs.LoadQueue();

    var result;
    assetqueue.addEventListener('fileload', function(e) {
      self.assets[e.item.id] = e.result;
    });

    assetqueue.addEventListener('complete', function() {
      self.graphics.init();

      _.each(result.items, function(item) {
        self.createItem(item);
      });

      self.start();
    });

    defqueue.addEventListener('fileload', function(e) {
      result = e.result;

      self.defs = result.defs;

      var defsAndItems = _.compact(_.toArray(result.defs).concat(result.items));
      var manifest = [];
      _.each(defsAndItems, function(defOrItem, name) {
        _.each(defOrItem.graphics, function(graphic) {
          var img = graphic.image;
          if (!img) return;

          manifest.push({
            id: img,
            src: img
          });
        });
      });
      assetqueue.loadManifest(manifest);
    });

    defqueue.loadFile({
      id: defs,
      src: defs
    });
  };

  self.start = function() {
    createjs.Ticker.addListener(function() {
      self.trigger('tick');
    });
  };
}
