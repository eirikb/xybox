xybox = (function() {
  var pkg =

{
  "name": "xybox",
  "author": {
    "name": "Eirik Brandtzæg"
  },
  "version": "1.0.2",
  "devDependencies": {
    "grunt": "~0.4.1",
    "grunt-contrib": "~0.7.0"
  }
}

var helpers = {
  deepDefaults: function(obj, def) {
    if (_.isObject(obj) && _.isObject(def)) {
      _.defaults(obj, def);
      _.each(obj, function(val, key) {
        helpers.deepDefaults(val, def[key]);
      });
    }
  }
};

function Events(game) {
  var listeners = {};

  game.on = function(name, priority, cb) {
    if (arguments.length === 2) {
      cb = priority;
      priority = 1;
    }

    if (!listeners[name]) listeners[name] = [];

    listeners[name].push({
      priority: priority,
      callback: cb
    });
    listeners[name].sort(function(a, b) {
      return a.priority > b.priority;
    });
  };

  game.trigger = function(name) {
    var ret;
    var args = _.toArray(arguments).slice(1);
    _.each(listeners[name], function(listener) {
      var r;

      r = listener.callback.apply(null, args);
      if (typeof r !== 'undefined') ret = r;
    });
    return ret;
  };
}

// Preloading using PreloadJS ( https://github.com/CreateJS/PreloadJS/ )
function Preload(game, center) {
  var self = this;
  var allDefs;

  function loadDefs(defPaths, cb) {
    defPaths = _.flatten([defPaths]);

    var queue = new createjs.LoadQueue();
    var defs = [];
    var src;

    function addPathToDef(def) {
      var path = src.match(/.*\//);
      path = path ? path[0] : '';
      path += def;
      if (!path.match(/\.json$/i)) path += '.json';
      return path;
    }

    queue.addEventListener('fileload', function(e) {
      src = e.item.src;
      defs.push(e.result);
      allDefs.push(e.result);
    });

    queue.addEventListener('complete', function() {
      var count = _.reduce(defs, function(memo, def) {
        return _.flatten([def.includes]).length + memo;
      }, 0);

      _.each(defs, function(def) {
        if (def.includes) {
          def.includes = _.map(def.includes, addPathToDef);
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
    });

    queue.addEventListener('complete', cb);

    _.each(defsAndItems, function(defOrItem, name) {
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

// Physics using trolley ( https://github.com/eirikb/trolley )
physics = (function() {
  var self = {};

  var world = self.world = trolley.init();

  var lastUpdate = Date.now();
  var velocityIterationsPerSecond = 300;
  var positionIterationsPerSecond = 200;
  var destroyList = [];

  /*
  events.on('onload', function() {
    velocityIterationsPerSecond = meta.velocityIterationsPerSecond || velocityIterationsPerSecond;
    positionIterationsPerSecond = meta.positionIterationsPerSecond || positionIterationsPerSecond;
    if (!meta.gravity) {
      meta.gravity = {
        x: 0,
        y: 0
      };
    }
    world.SetGravity(new b2Vec2(meta.gravity.x, meta.gravity.y));
  });

  self.createBody = function(object) {
    if (!object.body) return;
    object.body = trolley.build(object.body).create()[0];

    // Reference back from body, used for Box2D collisions
    if (object.body) object.body.object = object;
  };

  self.overlapping = function(body) {
    var overlaps = [];
    var bf = body.GetFixtureList();

    function checkQuery(f) {
      if (f !== bf && f.GetAABB().TestOverlap(bf.GetAABB())) {
        overlaps.push(f.GetBody());
      }
      return true;
    }

    while (bf !== null) {
      physics.world.QueryAABB(checkQuery, bf.GetAABB());
      bf = bf.GetNext();
    }
    return overlaps;
  };

  self.collide = function(def, cb) {
    events.on('collide', function(a, b) {
      if (!a || !b) return;
      var d = a.def === def ? a : b;
      if (d.def !== def) return;
      if (d === b) b = a;
      cb(d, b);
    });
  };

  function triggerCollide(trigger, contact, x) {
    var a = contact.m_fixtureA.m_body.object;
    var b = contact.m_fixtureB.m_body.object;
    events.trigger(trigger, a, b, x);
  }

  var listener = new b2ContactListener();
  listener.BeginContact = function(contact) {
    triggerCollide('collide', contact);
    triggerCollide('begincontact', contact);
  };
  listener.EndContact = function(contact) {
    triggerCollide('endcontact', contact);
  };
  listener.PostSolve = function(contact, impulse) {
    triggerCollide('postsolve', contact, impulse);
  };
  listener.PreSolve = function(contact, oldManifold) {
    triggerCollide('presolve', contact, oldManifold);
  };
  world.SetContactListener(listener);

  world.SetContactFilter({
    ShouldCollide: function(fixtureA, fixtureB) {
      var objectA, objectB;

      objectA = fixtureA.m_body.object;
      objectB = fixtureB.m_body.object;
      return events.trigger('shouldcollide', objectA, objectB);
    }
  });

  events.on('objectCreate', function(object) {
    self.createBody(object);
  });

  events.on('objectDestroy', function(object) {
    if (object.body) destroyList.push(object.body);
  });

  events.on('tick', 3, function() {
    world.ClearForces();
  });

  events.on('tick', -1, function() {
    _.each(destroyList, function(body) {
      world.DestroyBody(body);
    });
    destroyList = [];

    var time = new Date().getTime();
    var delta = (time - lastUpdate) / 1000;
    lastUpdate = time;

    if (delta > 10) {
      delta = 1 / game.fps;
    }
    step(world, delta);
  });

  function step(w, delta) {
    w.Step(delta, delta * velocityIterationsPerSecond, delta * positionIterationsPerSecond);
  }

  return self;
 */
})();

// Graphics using EaselJS ( https://github.com/CreateJS/EaselJS/ )
function Graphics(game, center) {
  var self = this;
  var stage;

  function draw(item) {
    var p = game.pos(item);
    _.each(item.graphics, function(graphics) {
      graphics.x = p.x + graphics.regX;
      graphics.y = p.y + graphics.regY;
      if (graphics.paddX) graphics.x += graphics.paddX;
      if (graphics.paddY) graphics.y += graphics.paddY;
      if (item.body) graphics.rotation = -(item.body.GetAngle() * 180 / Math.PI);
    });
  }

  game.pos = function(item) {
    var pos;

    if (item.body) {
      pos = trolley.pos(item.body);
      return {
        x: pos.x * game.scale,
        y: game.height - pos.y * game.scale - item.body.height * game.scale
      };
    } else {
      return item;
    }
  };

  self.createItem = function(item) {
    createGraphics(item);
    _.each(item.graphics, function(g) {
      if (g.loop) {
        g.onAnimationEnd = function() {
          g.loop--;
          if (g.loop === 0) {
            if (item.body) game.destroyItem(item);
            else stage.removeChild(g);
            return;
          }
          g.gotoAndPlay(g.currentAnimation);
        };
      }
    });
    draw(item);
  };

  function createGraphics(item) {
    var newGraphics = [];

    _.each(item.graphics, function(graphics) {
      var w, h;
      if (item.body) {
        w = item.body.width * game.scale;
        h = item.body.height * game.scale;
      } else {
        w = graphics.width;
        h = graphics.height;
      }


      if (!graphics.image) throw new Error('Missing graphics image: ' + item.def);
      var img = center.assets[graphics.image];
      if (!img) throw new Error('Unknown graphics image: ' + graphics.image);
      var shape;

      if (!w) w = img.width;
      if (!h) h = img.height;

      if (graphics.animations) {
        console.log(1);
        graphics.images = [img.src];
        var sheet = new createjs.SpriteSheet(graphics);
        shape = new createjs.BitmapAnimation(sheet);
        if (item.animation) graphics.animation = item.animation;
        if (!graphics.animation) graphics.animation = 'default';
        var doPlay = !! graphics.animations[graphics.animation];
        //doPlay = doPlay && doPlay.length > 1;
        var call = 'gotoAnd' + (doPlay ? 'Play' : 'Stop');
        shape[call](graphics.animation);
      } else {
        shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginBitmapFill(img);
        g.drawRect(0, 0, w, h);
        shape.cache(0, 0, w, h);
      }

      if (item.rotation) shape.rotation = item.rotation;
      shape.paddX = graphics.paddX;
      shape.paddY = graphics.paddY;
      shape.regX = w / 2;
      shape.regY = h / 2;
      shape.loop = graphics.loop;
      shape.width = w;
      shape.height = h;

      if (graphics.zindex) stage.addChildAt(shape, graphics.zindex);
      else stage.addChild(shape);
      newGraphics.push(shape);
      if (graphics.name) newGraphics[graphics.name] = shape;
    });
    item.graphics = newGraphics;
  }

  self.init = function() {
    game.width = game.canvas.width;
    game.height = game.canvas.height;
    game.center = {
      x: game.width / 2,
      y: game.height / 2
    };
    stage = game.stage = new createjs.Stage(game.canvas);

    stage.onMouseMove = function(event) {
      game.trigger('mouseMove', event);
    };
    stage.onMouseDown = function(event) {
      game.trigger('mouseDown', event);
    };
    stage.onMouseUp = function(event) {
      game.trigger('mouseUp', event);
    };
  };


  self.itemDestroy = function(item) {
    _.each(item.graphics, function(graphics) {
      stage.removeChild(graphics);
    });
  };

  game.on('tick', 2, function() {
    _.each(game.actives, draw);

    for (var i = 0; i < stage.getNumChildren(); i++) {
      var shape = stage.getChildAt(i);
      var x = shape.x + stage.x;
      var y = shape.y + stage.y;
      shape.visible = x >= 0 && x < game.canvas.width + shape.width && y >= 0 && y < game.canvas.height + shape.height;
    }

    stage.update();
  });
}

function Game() {
  var self = this;

  // centralized object to store all internal properties
  var center = {};

  // Keyboard input using kibo ( https://github.com/marquete/kibo )
  self.version = pkg.version;
  self.items = [];
  self.actives = [];
  center.keys = new Kibo();
  center.events = new Events(self, center);
  center.graphics = new Graphics(self, center);
  center.preload = new Preload(self, center);

  function start() {
    createjs.Ticker.addListener(function() {
      self.trigger('tick');
    });
  }

  self.createItem = function(item) {
    var def;
    if (item.def) def = center.defs[item.def];
    if (def) helpers.deepDefaults(item, def);
    if (item.name) self[item.name] = item;
    self.items.push(item);
    if (def && def.body && !def.body.isStatic) self.actives.push(item);
    center.graphics.createItem(item);

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
    center.preload.init(defs, function() {

      _.each(center.items, function(item) {
        self.createItem(item);
      });

      start();
    });
  };
}

  return {
    Game: Game,
    version: pkg.version
  };
})();
