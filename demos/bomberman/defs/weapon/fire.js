(function() {
    var ways = {
        left: [-1, 0],
        up: [0, 1],
        right: [1, 0],
        down: [0, -1]
    };

    function addFire(bomb, x, y, type, power) {
        power = power - 1;
        if (power <= 0) return;
        var playType = type;
        if (power > 1) {
            if (type === 'left' || type === 'right') playType = 'horizontal';
            if (type === 'up' || type === 'down') playType = 'vertical';
        }
        var f = game.createObject({
            def: 'fire',
            type: type,
            power: power,
            bomb: bomb,
            body: {
                x: x + 0.2,
                y: y + 0.2
            }
        });
        f.graphics[0].gotoAndPlay(playType);
        var overlapping = game.overlapping(f).filter(function(o) {
            return o.def !== 'fire' && f.bomb !== o;
        });
        _.each(overlapping, function(b) {
            collide(f, b);
        });
        if (overlapping.length > 0) return;
        if (type === 'core') {
            _.each(ways, function(w, n) {
                addFire(bomb, x + w[0], y + w[1], n, power);
            });
            return;
        }
        var w = ways[type];
        addFire(bomb, x + w[0], y + w[1], type, power);
    }

    events.on('explode', function(bomb) {
        var pos = trolley.pos(bomb.body);
        addFire(bomb, pos.x, pos.y, 'core', bomb.power);
    });

    function collide(a, b) {
        if (!a || !b) return;
        var fire = a.def === 'fire' ? a : b;
        if (fire.def !== 'fire') return true;
        if (fire === b) b = a;
        fire.power = 0;
        game.destroyObject(fire);
        events.trigger('fire', fire, b);
    }

    events.on('collide', collide);
})();
