(function() {
    var zombies, way;

    // This should work!
    //events.on('onload', function() {
    //});
    setTimeout(function() {
        zombies = _.filter(game.objects, function(object) {
            return object.objectdef === 'zombie';
        });

        _.each(zombies, function(zombie) {});

        events.on('tick', function() {
            var v;

            _.each(zombies, function(zombie) {
                var prevWay, animation;

                prevWay = way;
                if (trolley.pos(game.player.body).x > trolley.pos(zombie.body).x) way = 1;
                else way = - 1;

                if (prevWay !== way) {
                    if (way === 1) animation = 'right';
                    else animation = 'left';
                    zombie.graphics[0].gotoAndPlay(animation);
                }

                v = zombie.body.GetLinearVelocity();
                v.Set(way * zombie.speed, v.y);
            });
        });
    },
    1000);
})();

