(function() {
    var hacks = [];

    events.on('fire', function(fire, b) {
        if (b.def === 'brick') {
            var pos = trolley.pos(b.body);
            game.destroyObject(b);
            hacks.push({
                def: 'firebrick',
                body: {
                    x: pos.x,
                    y: pos.y
                }
            });
        }
    });

    events.on('tick', function() {
        var newHacks = hacks.slice();
        hacks = [];
        _.each(newHacks, function(hack) {
            game.createObject(hack);
        });
    });

    physics.collide('stairs', function(stairs, b) {
        if (b.def === 'player') bomberman(stairs.level);
    });
})();
