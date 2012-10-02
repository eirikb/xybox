// Physics using trolley ( https://github.com/eirikb/trolley )
physics = (function() {
    var self = {};

    var world = self.world = trolley.init();

    var lastUpdate = Date.now();
    var velocityIterationsPerSecond = 300;
    var positionIterationsPerSecond = 200;
    var destroyList = [];

    events.on('onload', function() {
        velocityIterationsPerSecond = meta.velocityIterationsPerSecond || velocityIterationsPerSecond;
        positionIterationsPerSecond = meta.positionIterationsPerSecond || positionIterationsPerSecond;
        if (meta.gravity) {
            world.SetGravity(new b2Vec2(meta.gravity.x, meta.gravity.y));
        }
    });

    self.createBody = function(object) {
        object.body = trolley.build(object.body).create()[0];

        // Reference back from body, used for Box2D collisions
        if (object.body) object.body.object = object;
    };

    self.overlapping = function(body) {
        var overlaps = [];
        var bf = body.GetFixtureList();
        while (bf !== null) {
            physics.world.QueryAABB(function(f) {
                if (f !== bf && f.GetAABB().TestOverlap(bf.GetAABB())) {
                    overlaps.push(f.GetBody());
                }
                return true;
            }, bf.GetAABB());
            bf = bf.GetNext();
        }
        return overlaps;
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
        destroyList.push(object.body);
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
})();
