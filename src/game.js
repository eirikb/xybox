function Game() {
  var self = this;

  // centralized object to store all internal properties
  var center = {};

  // Keyboard input using kibo ( https://github.com/marquete/kibo )
  self.version = pkg.version;
  self.items = [];
  self.actives = [];
  self.scale = 16;
  center.keys = new Kibo();
  center.events = new Events(self, center);
  center.graphics = new Graphics(self, center);
  center.preload = new Preload(self, center);
  center.physics = new Physics(self, center);

  function start() {
    createjs.Ticker.addListener(function() {
      self.trigger('tick');
    });
    self.trigger('game:start');
  }

  self.createItem = function(item) {
    var def;
    if (item.def) def = center.defs[item.def];
    if (def) helpers.deepDefaults(item, def);
    if (item.name) self[item.name] = item;
    self.items.push(item);
    if (def && def.body && !def.body.isStatic) self.actives.push(item);
    center.physics.createItem(item);
    center.graphics.createItem(item);

    if (item.code) {
      var f = item.code.match(/ (.*)$/);
      if (f && f.length > 1) window[f[1]](item, self);
    }

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
    center.graphics.init();
    center.physics.init();
    center.preload.init(defs, function() {

      _.each(center.items, function(item) {
        self.createItem(item);
      });

      start();
    });
  };
}
