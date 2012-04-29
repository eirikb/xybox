(function() {
    var way, keys;

    way = 0;
    keys = {
        left: ['a', 'left'],
        up: ['w', 'up'],
        right: ['d', 'right']
    };

    game.tick(function() {
        var pos, v;

        v = game.player.body.GetLinearVelocity();
        v.Set(way * game.player.speed, v.y);

        pos = graphics.pos(game.player);
    });

    game.keys.down(keys.left, function() {
        if (way !== - 1) game.player.graphics.bottom.gotoAndPlay('left');
        way = - 1;
    }).up(keys.left, function() {
        if (way === - 1) {
            way = 0;
            game.player.graphics.bottom.gotoAndStop('default');
        }
    });

    game.keys.down(keys.right, function() {
        if (way !== 1) game.player.graphics.bottom.gotoAndPlay('right');
        way = 1;
    }).up(keys.right, function() {
        if (way === 1) {
            way = 0;
            game.player.graphics.bottom.gotoAndStop('default');
        }
    });

    game.keys.down(keys.up, function() {
        var v = game.player.body.GetLinearVelocity();
        v.Set(v.x, game.player.speed);
    });
})();

