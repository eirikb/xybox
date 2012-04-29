// Physics using trolley ( https://github.com/eirikb/trolley )
physics = (function() {
    var self, lastUpdate, velocityIterationsPerSecond, positionIterationsPerSecond;

    self = {};
    lastUpdate = Date.now();
    velocityIterationsPerSecond = 300;
    positionIterationsPerSecond = 200;

    self.createBody = function(object) {
        object.body = trolley.build(object.body).create()[0];
        
        // Reference back from body, used for Box2D collisions
        if (object.body) object.body.object = object;
    };

    game.world.SetContactFilter({
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
    /*
    events.on('onload', function() {
        _.each(game.objects, function(object) {
            self.createBody(object);
        });
    });
    */

    events.on('tick', 2, function() {
        game.world.ClearForces();
    });

    events.on('tick', function() {
        var time, delta;

        time = new Date().getTime();
        delta = (time - lastUpdate) / 1000;
        lastUpdate = time;

        if (delta > 10) {
            delta = 1 / game.fps;
        }
        step(game.world, delta);
    });

    function step(w, delta) {
        w.Step(delta, delta * velocityIterationsPerSecond, delta * positionIterationsPerSecond);
    }

    return self;
})();

