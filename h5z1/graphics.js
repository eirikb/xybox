// Graphics using EaselJS ( https://github.com/CreateJS/EaselJS/ )
graphics = (function() {
    var self, scale, stage, width, height;

    self = {};
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
            var newGraphics = [];

            _.each(object.graphics, function(graphics) {
                var g, w, h, shape, sheet;

                w = object.body.width * scale;
                h = object.body.height * scale;
                if (graphics.id) {
                    shape = new Shape();
                    graphics = assets[graphics.id];
                    g = shape.graphics;
                    g.beginBitmapFill(graphics);
                    g.drawRect(0, 0, w, h);
                } else {
                    sheet = new SpriteSheet(graphics);
                    shape = new BitmapAnimation(sheet);
                    shape.gotoAndStop('default');
                }
                shape.paddX = graphics.paddX;
                shape.paddY = graphics.paddY;
                shape.regX = w / 2;
                shape.regY = h / 2;
                stage.addChild(shape);
                newGraphics.push(shape);
                if (graphics.name) newGraphics[graphics.name] = shape;
            });
            object.graphics = newGraphics;
        });
    });

    game.tick(function() {
        _.each(game.objects, function(object) {
            var p = pos(object.body);
            _.each(object.graphics, function(graphics) {
                graphics.x = p.x + graphics.regX;
                graphics.y = p.y + graphics.regY;
                if (graphics.paddX) graphics.x += graphics.paddX;
                if (graphics.paddY) graphics.y += graphics.paddY;
                graphics.rotation = - (object.body.GetAngle() * 180 / Math.PI);
            });
        });

        stage.update();
    });
    return self;
})();

