(function() {
    var monsters = [];

    var ways = {
        left: {
            xDir: -1
        },
        up: {
            yDir: 1
        },
        right: {
            xDir: 1
        },
        down: {
            yDir: -1
        }
    };

    events.on('objectCreate', function(object) {
        if (object.def !== 'ghost') return;
        monsters.push(object);
        object.initialBump = object.bump;
        object.bump = 0;
        object.way = ways[_.random(0, 4)];
    });

    events.on('tick', function() {
        _.each(monsters, function(monster) {
            if (monster.wait > 0) return monster.wait--;
            if (--monster.bump <= 0) {
                monster.bump = monster.initialBump;
                var way = _.keys(ways)[_.random(0, 3)];
                monster.way = ways[way];
                monster.graphics[0].gotoAndPlay(way);
            }

            if (!way) return;
            var v = monster.body.GetLinearVelocity();
            var way = monster.way;
            var x = way.xDir || 0; 
            var y = way.yDir || 0; 
            v.Set(x * monster.speed, y * monster.speed);
        });
    });

    physics.collide('ghost', function(player, b) {
        if (b.def !== 'player') return;
        events.trigger('death');
    });
})();
