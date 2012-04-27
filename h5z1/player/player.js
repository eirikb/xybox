(function() {
    var player, keys;

    keys = {
        left: ['a', 'left'],
        up: ['w', 'up'],
        right: ['d', 'right']
    };

    game.manifest('player/player2.png');
    game.manifest({
        src: 'player/player.json',
        id: 'player'
    });

    game.onload(function(assets) {
        player = JSON.parse(_.first(_.filter(assets, function(a) {
            return a.id === 'player';
        })).result);
        player.body.x = 10;
        player.body.y = 10;
        player.body = trolley.build(player.body).create()[0];
        player.way = 0;
    });

    game.tick(function() {
        var v = player.body.GetLinearVelocity();
        v.Set(player.way * player.speed, v.y);
    });

    game.keys.down(keys.left, function() {
        player.way = - 1;
    }).up(keys.left, function() {
        if (player.way === - 1) player.way = 0;
    });

    game.keys.down(keys.right, function() {
        player.way = 1;
    }).up(keys.right, function() {
        if (player.way === 1) player.way = 0;
    });

    game.keys.down(keys.up, function() {
        var v = player.body.GetLinearVelocity();
        v.Set(v.x, player.speed);
    });

    return self;
})();

