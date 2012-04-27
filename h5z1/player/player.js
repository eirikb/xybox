(function() {
    var way, keys;

    way = 0;
    keys = {
        left: ['a', 'left'],
        up: ['w', 'up'],
        right: ['d', 'right']
    };

    game.manifest('player/player.png');
    game.manifest('player/player.json');

    game.tick(function() {
        var v = game.player.body.GetLinearVelocity();
        v.Set(way * game.player.speed, v.y);
    });

    game.keys.down(keys.left, function() {
        way = - 1;
    }).up(keys.left, function() {
        if (way === - 1) way = 0;
    });

    game.keys.down(keys.right, function() {
        way = 1;
    }).up(keys.right, function() {
        if (way === 1) way = 0;
    });

    game.keys.down(keys.up, function() {
        var v = game.player.body.GetLinearVelocity();
        v.Set(v.x, game.player.speed);
    });
})();

