(function() {
    var zombies;

    zombies = [];

    events.on('objectCreate', function(object) {
        if (object.def === 'zombie') zombies.push(object);
    });

    events.on('tick', function() {
        _.each(zombies, function(zombie) {
            var way, animation;

            var px = trolley.pos(game.player.body).x;
            var zx = trolley.pos(zombie.body).x;

            if (Math.abs(px - zx) > 15) zombie.wait = 10;

            if (zombie.wait > 0) return zombie.wait--;

            if (!zombie.prevWay) zombie.prevWay = 0;
            way = px > zx ? 1 : -1;

            if (zombie.prevWay !== way) {
                if (way === 1) animation = 'right';
                else animation = 'left';
                zombie.graphics[0].gotoAndPlay(animation);
                if (!zombie.wait || zombie.wait <= 0) zombie.wait = 40;
            }
            zombie.prevWay = way;

            var v = zombie.body.GetLinearVelocity();
            v.Set(way * zombie.speed, v.y);
        });
    });

    events.on('collide', function(a, b) {
        var zombie = a.def === 'zombie' ? a : b;
        if (zombie.def !== 'zombie') return;
        if (zombie === b) b = a;

        if (zombie && b.def === 'bullet' && !b.used) {
            b.used = true;

            var v = b.body.GetLinearVelocity();
            if (b.power) power = b.power;
            else power = 1;

            var damage = Math.floor(((Math.abs(v.x) + Math.abs(v.y)) * a.body.GetMass() / 10) * power);
            zombie.life -= damage;

            if (zombie.life <= 0) {
                pos = graphics.pos(zombie);
                game.createObject({
                    def: 'blowup',
                    x: pos.x - 50,
                    y: pos.y - 80
                });
                game.destroyObject(zombie);
            }

            if (damage > 0 && b.def === 'bullet') {
                pos = graphics.pos(zombie);
                game.createObject({
                    def: 'blood',
                    x: pos.x,
                    y: pos.y - 15
                });
            }
        }
    });
})();

