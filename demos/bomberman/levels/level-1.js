(function() {
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

    events.on('ready', function() {
        var width = graphics.width / (game.player.body.width * graphics.scale);
        var height = graphics.height / (game.player.body.height * graphics.scale);

        _(height - 1).times(function(y) {
            _(width - 1).times(function(x) {
                var addBrick = Math.random() < 0.5;

                if (x % 2 === 1 && y % 2 === 1) create('block', x, y);
                if ((x < 2 || x > width - 3) && (y < 2 || y > height - 3)) return;
                if (addBrick && (x % 2 === 0 || y % 2 === 0)) {
                    events.trigger('brick', x, y);
                    create('brick', x, y);
                }
            });
        });

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
