(function() {
    game.manifest({
        src: 'world/level-1.json',
        id: 'level-1'
    }),
    game.manifest('world/bg.png');
    game.manifest('world/ground.png')
    game.manifest('world/box.png');

    game.preOnload(function(assets) {
        // Load the first level
        level = JSON.parse(_.first(_.filter(assets, function(a) {
            return a.id === 'level-1';
        })).result);
        _.extend(game, level.world);
    });
})();

