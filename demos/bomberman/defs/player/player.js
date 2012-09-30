(function() {
    var xDir = 0;
    var yDir = 0;

    var ways = {
        left: {
            key: 'a',
            xDir: -1
        },
        up: {
            key: 'w',
            yDir: 1
        },
        right: {
            key: 'd',
            xDir: 1
        },
        down: {
            key: 's',
            yDir: -1
        }
    };

    events.on('tick', function() {
        var v = game.player.body.GetLinearVelocity();
        v.Set(xDir * game.player.speed, yDir * game.player.speed);
    });

    _.each(ways, function(way, name) {
        var keys = [name, way.key];

        game.keys.down(keys, function() {
            if ((way.xDir && way.xDir !== xDir) || (way.yDir && way.yDir !== yDir)) {
                game.player.graphics[0].gotoAndPlay(name);
            }
            if (way.xDir) xDir = way.xDir;
            if (way.yDir) yDir = way.yDir;
            return;
        }).up(keys, function() {
            if (xDir === way.xDir) xDir = 0;
            if (yDir === way.yDir) yDir = 0;
            if (xDir === 0 && yDir === 0) game.player.graphics[0].stop();
            _(ways).each(function(w, k) {
                if (w.xDir === xDir || w.yDir === yDir) game.player.graphics[0].gotoAndPlay(k);
            });
            return;
        });
    });
})();
