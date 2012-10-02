(function() {
    var types = {
        power: function() {
            game.player.power++;
        },
        bomb: function() {
            game.player.bombs++;
        },
        death: function() {
            events.trigger('death');
        },
        score: function() {}
    };

    events.on('brick', function(x, y) {
        if (Math.random() > 0.3) return;

        var type = _.keys(types);
        type = type[Math.floor(Math.random() * type.length)];

        var pu = game.createObject({
            def: 'powerup',
            type: type,
            body: {
                x: x + 0.1,
                y: y + 0.1
            }
        });
        pu.graphics[0].gotoAndStop(type);
    });

    events.on('collide', function(a, b) {
        var powerup = a.def === 'powerup' ? a : b;
        if (powerup.def !== 'powerup') return;
        if (powerup === b) b = a;

        types[powerup.type]();

        game.destroyObject(powerup);
    });
})();
