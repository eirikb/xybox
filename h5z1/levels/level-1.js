(function() {

    game.tick(function() {
        var pos;

        pos = graphics.pos(game.player);

        graphics.stage.x = - pos.x + graphics.width / 2;
        graphics.stage.y = - pos.y + graphics.height / 2;

        game.bg.graphics.x = - graphics.stage.x * 0.9;
        game.bg.graphics.y = - graphics.stage.y * 0.9;
    });
})();

