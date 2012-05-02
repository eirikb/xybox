(function() {
    var way, keys, jump;

    way = 0;
    keys = {
        left: ['a', 'left'],
        up: ['w', 'up'],
        right: ['d', 'right']
    };
    jump = false;

    events.on('tick', function() {
        var v;

        v = game.player.body.GetLinearVelocity();
        v.Set(way * game.player.speed, v.y);
    });

    game.keys.down(keys.left, function() {
        way = - 1;
    }).up(keys.left, function() {
        if (way === - 1) {
            way = 0;
        }
    });

    game.keys.down(keys.right, function() {
        way = 1;
    }).up(keys.right, function() {
        if (way === 1) way = 0;
    });

    game.keys.down(keys.up, function() {
        var v;

        if (!jump) {
            jump = true;
            v = game.player.body.GetLinearVelocity();
            v.Set(v.x, 1.5 * game.player.speed);
        }
    });

    events.on('collide', function(a, b) {
        var player;

        player = _.find([a, b], function(o) {
            return o.objectdef === 'player';
        });
        if (player) {
            jump = false;
        }
    });
})();

