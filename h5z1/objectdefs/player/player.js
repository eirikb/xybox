(function() {
    var way, keys, jump;

    way = 0;
    keys = {
        left: ['a', 'left'],
        up: ['w', 'up'],
        right: ['d', 'right']
    };
    jump = false;

    events.on('onload', function() {
    });

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
            paddX = -6;
        } else {
            paddX = -2;
        }
        game.player.graphics.top.paddX = paddX;
        game.player.graphics.top.gotoAndStop(x);
    });

    events.on('collide', function(a, b) {
        var player, isBullet;

        if (a.name === 'player') player = a;
        else if (b.name === 'player') player = b;

        isBullet = a.objectdef === 'bullet' || b.objectdef === 'bullet';

        if (player && !isBullet) {
            jump = false;
        }
    });
})();

