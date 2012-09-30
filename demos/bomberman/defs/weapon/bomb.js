(function() {
    var bombs = [];

    game.keys.down('space', function() {
        if (game.player.bombs < 1) return;
        game.player.bombs--;

        var pos = trolley.pos(game.player.body);

        var bomb = game.createObject({
            def: 'bomb',
            body: {
                x: pos.x + (game.player.body.width / 4),
                y: pos.y - (game.player.body.height / 4)
            }
        });

        bombs.push(bomb);
    });

    events.on('tick', function() {
        bombs = _.filter(bombs, function(bomb) {
            bomb.timer--;
            if (bomb.timer <= 0) {
                var pos = trolley.pos(bomb.body);
                game.destroyObject(bomb);
                events.trigger('explode', bomb);
                return false;
            }
            return true;
        });
    });

    events.on('shouldcollide', function(a, b) {
        var player = a.def === 'player' ? a : b;
        var bomb = a.def === 'bomb' ? a : b;
        if (player.def !== 'player' || bomb.def !== 'bomb') return;
        return --bomb.bump <= 0;
    });

    events.on('fire', function(fire, b) {
        if (b.def === 'bomb') b.timer = 0;
    });
})();
