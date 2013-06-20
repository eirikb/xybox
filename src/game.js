function Game() {
  var self = this;

  // centralized object to store all internal properties
  var core = {};

  // Keyboard input using kibo ( https://github.com/marquete/kibo )
  self.version = pkg.version;
  core.items = [];
  core.actives = [];
  core.scale = 16;
  core.keys = new Kibo();
  core.events = new Events(core);
  core.graphics = new Graphics(core);
  core.preload = new Preload(core);
  core.physics = new Physics(core);

  self.on = core.on;
  self.trigger = core.trigger;

  function start() {
    createjs.Ticker.addListener(function() {
      core.trigger('tick');
    });
    core.trigger('game:start');
  }

  self.createItem = function(item) {
    var def;
    if (item.def) def = core.defs[item.def];
    if (def) helpers.deepDefaults(item, def);
    if (item.name) core[item.name] = item;
    core.items.push(item);
    core.physics.createItem(item);
    core.graphics.createItem(item);

    if (item && item.body && !item.body.isStatic) core.actives.push(item);

    if (item.code) {
      var f = item.code.match(/ (.*)$/);
      if (f && f.length > 1) window[f[1]](item, self);
    }

    return item;
  };

  self.destroyItem = function(item) {
    core.items = _.without(core.items, item);
  };

  self.overlapping = function(item) {
    var overlaps = physics.overlapping(item.body);
    return _.chain(overlaps).compact().map(function(fixture) {
      return fixture.item;
    }).value();
  };

  self.init = function(canvasId, defs) {
    core.canvas = document.getElementById(canvasId);
    core.graphics.init();
    core.physics.init();
    core.preload.init(defs, function() {

      _.each(core.items, function(item) {
        self.createItem(item);
      });

      start();
    });
  };
}
