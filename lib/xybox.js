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

function Events(core) {
  var listeners = {};

  core.on = function(name, priority, cb) {
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

  core.trigger = function(name) {
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
function Preload(core) {
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
    core.assets = {};

    queue.addEventListener('fileload', function(e) {
      core.assets[e.item.id] = e.result;
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

      core.items = root.items;
      core.defs = root.defs;
      loadAssets(root, cb);
    });
  };
}

// Physics using trolley ( https://github.com/eirikb/trolley )
function Physics(core) {
  var self = this;

  var trolley = new Trolley();
  var world = trolley.world;
  core.world = world;

  var lastUpdate = Date.now();
  var velocityIterationsPerSecond = 300;
  var positionIterationsPerSecond = 200;
  var destroyList = [];

  core.pos = function(item) {
    var pos;

    if (item.body) {
      pos = trolley.pos(item.body);
      return {
        x: pos.x * core.scale,
        y: core.height - pos.y * core.scale - item.body.height * core.scale
      };
    } else {
      return item;
    }
  };


  self.init = function() {
    var gravity = {
      x: 0,
      y: 0
    };
    world.SetGravity(new b2Vec2(gravity.x, gravity.y));
  };

  self.createItem = function(object) {
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
    core.on('collide', function(a, b) {
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
    core.trigger(trigger, a, b, x);
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
      return core.trigger('shouldcollide', objectA, objectB);
    }
  });

  core.on('tick', -1, function() {
    _.each(destroyList, function(body) {
      world.DestroyBody(body);
    });
    destroyList = [];

    var time = new Date().getTime();
    var delta = (time - lastUpdate) / 1000;
    lastUpdate = time;

    if (delta > 10) {
      delta = 1 / core.fps;
    }
    step(world, delta);
  });

  function step(w, delta) {
    w.Step(delta, delta * velocityIterationsPerSecond, delta * positionIterationsPerSecond);
  }

  return self;
}

// Graphics using EaselJS ( https://github.com/CreateJS/EaselJS/ )
function Graphics(core) {
  var self = this;
  var stage;

  function draw(item) {
    var p = core.pos(item);
    _.each(item.graphics, function(graphics) {
      graphics.x = p.x; // + (graphics.scaleX * graphics.w) / 2;
      graphics.y = p.y; // + (graphics.scaleY * graphics.h) / 2;
      if (graphics.paddX) graphics.x += graphics.paddX;
      if (graphics.paddY) graphics.y += graphics.paddY;
      if (item.body) graphics.rotation = -(item.body.GetAngle() * 180 / Math.PI);
    });
  }

  self.createItem = function(item) {
    createGraphics(item);
    _.each(item.graphics, function(g) {
      if (g.loop) {
        g.onAnimationEnd = function() {
          g.loop--;
          if (g.loop === 0) {
            if (item.body) core.destroyItem(item);
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
      if (!graphics.image) throw new Error('Missing graphics image: ' + item.def);
      var img = core.assets[graphics.image];
      if (!img) throw new Error('Unknown graphics image: ' + graphics.image);
      var shape;

      var w, h;

      if (graphics.animations) {
        w = graphics.width || graphics.frames.width;
        h = graphics.height || graphics.frames.height;
        if (item.body) {
          w = item.body.width * core.scale;
          h = item.body.height * core.scale;
        }
        graphics.images = [img.src];
        var sheet = new createjs.SpriteSheet(graphics);
        shape = new createjs.BitmapAnimation(sheet);
        if (item.animation) graphics.animation = item.animation;
        if (!graphics.animation) graphics.animation = 'default';
        var doPlay = !! graphics.animations[graphics.animation];
        var call = 'gotoAnd' + (doPlay ? 'Play' : 'Stop');
        shape[call](graphics.animation);
        shape.width = w;
        shape.height = h;
        shape.scaleX = w / graphics.frames.width;
        shape.scaleY = h / graphics.frames.height;
      } else {
        w = graphics.width || img.width;
        h = graphics.height || img.height;
        if (item.body) {
          w = item.body.width * core.scale;
          h = item.body.height * core.scale;
        }
        shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginBitmapFill(img);
        if (graphics.type === 'repeat') {
          g.drawRect(0, 0, w, h);
        } else {
          g.drawRect(0, 0, img.width, img.height);
          shape.scaleX = w / img.width;
          shape.scaleY = h / img.height;
        }
        shape.width = w;
        shape.height = h;
      }

      if (item.rotation) shape.rotation = item.rotation;
      shape.paddX = graphics.paddX;
      shape.paddY = graphics.paddY;

      shape.regX = shape.w / 2;
      shape.regY = shape.h / 2;

      shape.loop = graphics.loop;

      if (graphics.zindex) stage.addChildAt(shape, graphics.zindex);
      else stage.addChild(shape);
      newGraphics.push(shape);
      if (graphics.name) newGraphics[graphics.name] = shape;
    });
    item.graphics = newGraphics;
  }

  self.init = function() {
    core.width = core.canvas.width;
    core.height = core.canvas.height;
    core.center = {
      x: core.width / 2,
      y: core.height / 2
    };
    stage = core.stage = new createjs.Stage(core.canvas);

    stage.onMouseMove = function(event) {
      core.trigger('mouseMove', event);
    };
    stage.onMouseDown = function(event) {
      core.trigger('mouseDown', event);
    };
    stage.onMouseUp = function(event) {
      core.trigger('mouseUp', event);
    };
  };


  self.itemDestroy = function(item) {
    _.each(item.graphics, function(graphics) {
      stage.removeChild(graphics);
    });
  };

  core.on('tick', 2, function() {
    _.each(core.actives, draw);

    for (var i = 0; i < stage.getNumChildren(); i++) {
      var shape = stage.getChildAt(i);
      var x = shape.x + stage.x;
      var y = shape.y + stage.y;
      shape.visible = x >= 0 && x < core.canvas.width + shape.width && y >= 0 && y < core.canvas.height + shape.height;
    }

    stage.update();
  });
}

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

  return {
    Game: Game,
    version: pkg.version
  };
})();
