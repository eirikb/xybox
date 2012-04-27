// Graphics using EaselJS ( https://github.com/CreateJS/EaselJS/ )
graphics = (function() {
    var stage, width, height, self = {},
    scale = 15;

    function pos(body) {
        var pos = trolley.pos(body);
        return {
            x: pos.x * scale,
            y: height - pos.y * scale - body.height * scale
        };
    };

    game.onload(function(assets) {
        var bg, canvas = document.getElementById('gamepanel');
        width = canvas.width,
        height = canvas.height
        stage = new Stage(canvas);
        stage.autoClear = false;

        bg = assets.bg;
        bg = new Shape(new Graphics().beginBitmapFill(bg).drawRect(0, 0, width, height));
        stage.addChild(bg);

        _.each(game.objects, function(object) {
            var g, w, h, shape, graphics;

            graphics = assets[object.graphics];
            if (graphics) {
                w = object.body.width * scale;
                h = object.body.height * scale;

                shape = new Shape();
                g = shape.graphics;
                g.beginBitmapFill(graphics);
                g.drawRect(0, 0, w, h);
                shape.regX = w / 2;
                shape.regY = h / 2;
                object.graphics = shape;
                stage.addChild(shape);
            }
        });
    });

    game.tick(function() {
        _.each(game.objects, function(object) {
            var p = pos(object.body);
            object.graphics.x = p.x + object.graphics.regX;
            object.graphics.y = p.y + object.graphics.regY;
            object.graphics.rotation = - (object.body.GetAngle() * 180 / Math.PI);
        });

        stage.update();
    });
    return self;
})();

