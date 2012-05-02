// Physics using trolley ( https://github.com/eirikb/trolley )
physics = (function() {
    var self, world, lastUpdate, velocityIterationsPerSecond, positionIterationsPerSecond, destroyList;

    self = {};

    world = self.world = trolley.init();

    lastUpdate = Date.now();
    velocityIterationsPerSecond = 300;
    positionIterationsPerSecond = 200;
    destroyList = [];

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

    world.SetContactFilter({
        ShouldCollide: function(fixtureA, fixtureB) {
            var objectA, objectB;

            objectA = fixtureA.m_body.object;
            objectB = fixtureB.m_body.object;
            return events.trigger('collide', objectA, objectB);
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
        var time, delta;

        _.each(destroyList, function(body) {
            world.DestroyBody(body);
        });
        destroyList = [];

        time = new Date().getTime();
        delta = (time - lastUpdate) / 1000;
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

