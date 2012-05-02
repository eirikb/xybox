(function() {

    events.on('tick', function() {
        var pos;

        pos = graphics.pos(game.player);

        graphics.stage.x = - pos.x + graphics.center.x - 50;
        graphics.stage.y = - pos.y + graphics.center.y - 100;

        game.bg.x = - graphics.stage.x * 0.9;
        game.bg.y = - graphics.stage.y * 0.9;
    });
})();

