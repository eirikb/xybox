// Physics using trolley ( https://github.com/eirikb/trolley )
function Physics(game, center) {
  var self = this;

  var trolley = new Trolley();
  var world = trolley.world;
  game.world = world;

  var lastUpdate = Date.now();
  var velocityIterationsPerSecond = 300;
  var positionIterationsPerSecond = 200;
  var destroyList = [];

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
    game.on('collide', function(a, b) {
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
    game.trigger(trigger, a, b, x);
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
      return game.trigger('shouldcollide', objectA, objectB);
    }
  });

  /*
  game.on('objectCreate', function(object) {
    self.createBody(object);
  });

  game.on('objectDestroy', function(object) {
    if (object.body) destroyList.push(object.body);
  });

  game.on('tick', 3, function() {
    world.ClearForces();
  });
 */

  game.on('tick', -1, function() {
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
}
