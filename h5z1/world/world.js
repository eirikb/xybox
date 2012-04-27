(function() {
    game.manifest('world/world.json', 'world');
    game.manifest('world/level-1.json', 'level-1');
    game.manifest('world/bg.png', 'bg');
    game.manifest('world/ground.png', 'ground');
    game.manifest('world/box.png', 'box');

    game.preOnload(function(assets) {
        var level;

        // Load the first level
        level = JSON.parse(assets['level-1']);
        _.each(level.objects, function(object) {
            var type = game.types[object.type];
            if (type) helpers.deepDefaults(object, type);
            if (object.name) game[object.name] = object;
        });
        _.extend(game, level);
    });
})();

