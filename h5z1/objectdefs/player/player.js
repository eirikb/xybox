(function() {
    var way, keys, jump;

    way = 0;
    keys = {
        left: ['a', 'left'],
        up: ['w', 'up'],
        right: ['d', 'right']
    };
    jump = false;

    events.on('tick', function() {
        var v;

        v = game.player.body.GetLinearVelocity();
        v.Set(way * game.player.speed, v.y);
    });

    game.keys.down(keys.left, function() {
        if (way !== - 1) game.player.graphics.bottom.gotoAndPlay('left');
        way = - 1;
    }).up(keys.left, function() {
        if (way === - 1) {
            way = 0;
            game.player.graphics.bottom.gotoAndStop('default');
        }
    });

    game.keys.down(keys.right, function() {
        if (way !== 1) game.player.graphics.bottom.gotoAndPlay('right');
        way = 1;
    }).up(keys.right, function() {
        if (way === 1) {
            way = 0;
            game.player.graphics.bottom.gotoAndStop('default');
        }
    });

    game.keys.down(keys.up, function() {
        var v;

        if (!jump) {
            jump = true;
            v = game.player.body.GetLinearVelocity();
            v.Set(v.x, game.player.speed);
        }
    });

    events.on('mouseMove', function(event) {
        var mouseX, mouseY, rightDir, x, y, angle, paddX;

        mouseX = event.stageX - graphics.center.x;
        mouseY = event.stageY - graphics.center.y;
        rightDir = mouseX >= 0;
        y = rightDir ? 0: 1;
        x = 0;

        if (rightDir) mouseY *= - 1;
        angle = mouseX / mouseY;

        if (angle < - 2 || angle > 5) x = 0;
        else if (angle < 0) x = 2;
        else if (angle > 1) x = 1;
        else x = 3;

        if (!rightDir) {
            x += 4;
            paddX = - 6;
        } else {
            paddX = - 2;
        }
        game.player.graphics.top.paddX = paddX;
        game.player.graphics.top.gotoAndStop(x);
    });

    events.on('collide', function(a, b) {
        var player;

        player = _.find([a, b], function(o) {
            return o.objectdef === 'player';
        });
        if (player === a) a = b;

        if (player) {
            if (a.objectdef !== 'bullet') {
                jump = false;
                if (a.power) {
                    player.life -= a.power;

                    if (player.life <= 0) {
                        pos = graphics.pos(player);
                        game.createObject({
                            objectdef: 'blowup',
                            x: pos.x - 50,
                            y: pos.y - 80
                        });
                        game.destroyObject(player);
                    }

                    pos = graphics.pos(player);
                    game.createObject({
                        objectdef: 'blood',
                        x: pos.x,
                        y: pos.y - 15
                    });
                }
            }
        }
    });
})();

