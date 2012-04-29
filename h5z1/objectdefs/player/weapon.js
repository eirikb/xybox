(function() {
    var mouseX, mouseY, shooting, reload;

    reload = 0;

    function shoot() {
        var bullet, a, b, h, cos, sin, pos;

        a = mouseY - graphics.center.y;
        b = mouseX - graphics.center.x;
        if (mouseX >= 0) a *= - 1;
        else b *= - 1;
        h = Math.sqrt(a * a + b * b);

        cos = b / h;
        sin = a / h;

        pos = trolley.pos(game.player.body);
        pos.y += game.player.body.height;

        pos.x += cos * 4;
        pos.y += sin * 4;

        bullet = {
            objectdef: 'bullet',
            body: {
                x: pos.x,
                y: pos.y
            }
        };
        console.log(bullet)
        physics.createBody(bullet);
        graphics.createGraphics(bullet);
        game.objects.push(bullet);

        bullet.body.GetLinearVelocity().Set(cos * bullet.speed, sin * bullet.speed);
    }

    events.on('mouseMove', function(event) {
        mouseX = event.stageX;
        mouseY = event.stageY;
    });

    events.on('tick', function() {
        if (reload === 0) {
            if (shooting) {
                shoot();
                reload = 10;
            }
        } else {
            reload--;
        }
    });

    events.on('mouseDown', function(event) {
        shooting = true;
    });

    events.on('mouseUp', function(event) {
        shooting = false;
    });
})();

