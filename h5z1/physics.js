// Physics using trolley ( https://github.com/eirikb/trolley )
physics = (function() {
    var self, playerBody, lastUpdate, velocityIterationsPerSecond, positionIterationsPerSecond;

    self = {};
    lastUpdate = Date.now();
    velocityIterationsPerSecond = 300;
    positionIterationsPerSecond = 200;

    game.onload(function(assets) {
        _.each(game.objects, function(object) {
            object.body = trolley.build(object.body).create()[0];
        });
    });

    game.preTick(function() {
        game.world.ClearForces();
    });

    game.tick(function() {
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

