// Physics using trolley ( https://github.com/eirikb/trolley )
physics = (function() {
    var self, lastUpdate, velocityIterationsPerSecond, positionIterationsPerSecond;

    self = {};
    lastUpdate = Date.now();
    velocityIterationsPerSecond = 300;
    positionIterationsPerSecond = 200;

    events.on('onload', function() {
        _.each(game.objects, function(object) {
            object.body = trolley.build(object.body).create()[0];
        });
    });

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

