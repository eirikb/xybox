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

        /*
        _.each(_.range(-1, width + 1), function(x) {
            create('block', x, -1);
            create('block', x, height);
        });
        _.each(_.range(-1, height + 1), function(y) {
            create('block', -1, y);
            create('block', width, y);
        });

        graphics.stage.swapChildren(game.player.graphics[0], last.graphics[0]);
       */
    });
})();
