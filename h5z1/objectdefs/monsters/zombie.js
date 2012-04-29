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

        events.on('collide', function(a, b) {
            var zombie, v, damage, power;

            zombie = _.find([a, b], function(o) {
                return o.objectdef === 'zombie';
            });
            if (zombie === a) a = b;

            if (zombie) {
                v = a.body.GetLinearVelocity();
                if (a.power) power = a.power;
                else power = 1;

                damage = Math.floor(((Math.abs(v.x) + Math.abs(v.y)) * a.body.GetMass() / 10) * power);
                zombie.life -= damage;

                if (zombie.life <= 0) {
                    game.destroyObject(zombie);
                }
            }
        });
    },
    1000);
})();

