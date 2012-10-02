(function() {
    var bombs = [];

    game.keys.down('space', function() {
        if (game.player.bombs < 1) return;
        if (game.player.dead) return;
        game.player.bombs--;

        var pos = trolley.pos(game.player.body);

        var bomb = game.createObject({
            def: 'bomb',
            power: game.player.power,
            body: {
                x: pos.x,
                y: pos.y
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
                game.player.bombs++;
                events.trigger('explode', bomb);
                return false;
            }
            return true;
        });
    });

    events.on('shouldcollide', function(a, b) {
        if (!a || !b) return;
        var player = a.def === 'player' ? a : b;
        var bomb = a.def === 'bomb' ? a : b;
        if (player.def !== 'player' || bomb.def !== 'bomb') return;
        return --bomb.bump <= 0;
    });

    events.on('fire', function(fire, b) {
        if (b.def === 'bomb') b.timer = 0;
    });
})();
