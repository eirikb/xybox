(function() {
    var zombies;

    zombies = [];

    events.on('objectCreate', function(object) {
        if (object.objectdef === 'zombie') zombies.push(object);
    });

    events.on('tick', function() {
        var v;

        _.each(zombies, function(zombie) {
            var way, animation;

            if (!zombie.prevWay) zombie.prevWay = 0;
            if (trolley.pos(game.player.body).x > trolley.pos(zombie.body).x) way = 1;
            else way = - 1;

            if (zombie.prevWay !== way) {
                if (way === 1) animation = 'right';
                else animation = 'left';
                zombie.graphics[0].gotoAndPlay(animation);
            }
            zombie.prevWay = way;

            v = zombie.body.GetLinearVelocity();
            v.Set(way * zombie.speed, v.y);
        });
    });

    events.on('collide', function(a, b) {
        var zombie, v, damage, power, pos;

        zombie = _.find([a, b], function(o) {
            return o.objectdef === 'zombie';
        });
        if (zombie === a) a = b;

        if (zombie && a.objectdef === 'bullet' && !a.used) {
            a.used = true;

            v = a.body.GetLinearVelocity();
            if (a.power) power = a.power;
            else power = 1;

            damage = Math.floor(((Math.abs(v.x) + Math.abs(v.y)) * a.body.GetMass() / 10) * power);
            zombie.life -= damage;

            if (zombie.life <= 0) {
                pos = graphics.pos(zombie);
                game.createObject({
                    objectdef: 'blowup',
                    x: pos.x - 50,
                    y: pos.y - 80
                });
                game.destroyObject(zombie);
            }

            if (damage > 0 && a.objectdef === 'bullet') {
                pos = graphics.pos(zombie);
                game.createObject({
                    objectdef: 'blood',
                    x: pos.x,
                    y: pos.y - 15
                });
            }
        }
    });
})();

