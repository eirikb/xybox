(function() {
    var hacks = [];
    var last;

    function create(type, x, y) {
        last = game.createObject({
            def: type,
            body: {
                x: x,
                y: y
            }
        });
    }

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

    events.on('ready', function() {
        var width = graphics.width / (game.player.body.width * graphics.scale);
        var height = graphics.height / (game.player.body.height * graphics.scale);

        _.each(_.range(-1, width + 1), function(x) {
            create('block', x, -1);
            create('block', x, height);
        });
        _.each(_.range(-1, height + 1), function(y) {
            create('block', -1, y);
            create('block', width, y);
        });

        graphics.stage.swapChildren(game.player.graphics[0], last.graphics[0]);
    });
})();
