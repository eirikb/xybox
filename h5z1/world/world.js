(function() {
    game.manifest('world/world.json', 'world');
    game.manifest('world/level-1.json', 'level-1');
    game.manifest('world/bg.png', 'bg');
    game.manifest('world/ground.png', 'ground');
    game.manifest('world/box.png', 'box');

    game.preOnload(function(assets) {
        var world, level;

        world = JSON.parse(assets.world);

        // Load the first level
        level = JSON.parse(assets['level-1']);
        _.each(level.objects, function(object) {
            var type = world.types[object.type];
            if (type) helpers.defaults(object, type);
        });
        _.extend(game, level);
    });
})();

