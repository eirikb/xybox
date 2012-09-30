(function() {
    var fires = [];
    var ways = {
        left: [-1, 0],
        up: [0, 1],
        right: [1, 0],
        down: [0, -1]
    };

    function addFire(x, y, type, power) {
        var playType = type;
        if (power > 1) {
            if (type === 'left' || type === 'right') playType = 'horizontal';
            if (type === 'up' || type === 'down') playType = 'vertical';
        }
        var f = game.createObject({
            def: 'fire',
            type: type,
            power: power,
            body: {
                x: x,
                y: y
            }
        });
        f.graphics[0].gotoAndPlay(playType);
        var overlapping = game.overlapping(f).filter(function(o) {
            return o.def === 'brick' || o.def === 'block';
        });
        /*
        if (type !== 'core' && overlapping.length > 0) {
            _.each(overlapping, function(b) {
                collide(f, b);
            });
        } else {
            fires.push(f);
        }
        */
            fires.push(f);
        return f;
    }

    events.on('explode', function(bomb) {
        var pos = trolley.pos(bomb.body);
        addFire(pos.x, pos.y, 'core', bomb.power, bomb.power);
    });

    events.on('tick', function() {
        var newFires = fires.slice();
        fires = [];
        _.each(newFires, function(fire) {
            var pos = trolley.pos(fire.body);
            var power = fire.power - 1;
            if (power <= 0) return;
            if (fire.type === 'core') {
                _.each(ways, function(w, n) {
                    addFire(pos.x + w[0], pos.y + w[1], n, power);
                });
                return;
            }
            var way = ways[fire.type];
            addFire(pos.x + way[0], pos.y + way[1], fire.type, power);
        });
    });

    function collide(a, b) {
        var fire = a.def === 'fire' ? a : b;
        if (fire.def !== 'fire' || b.def === 'fire') return true;
        if (fire === b) b = a;
        fire.power = 0;
        game.destroyObject(fire);
        events.trigger('fire', fire, b);
    }

    events.on('collide', collide);

    events.on('shouldcollide', function(a, b) {
        if (a.def === 'fire' && b.def === 'fire') return false;
    });
})();
