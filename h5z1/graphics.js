// Graphics using EaselJS ( https://github.com/CreateJS/EaselJS/ )
graphics = (function() {
    var self, onMouseMoves;

    self = {};
    self.scale = 15;
    onMouseMoves = [];

    self.pos = function(object) {
        var pos;

        if (object.body) {
            pos = trolley.pos(object.body);
            return {
                x: pos.x * self.scale,
                y: self.height - pos.y * self.scale - object.body.height * self.scale
            };
        } else {
            return object.graphics;
        }
    };

    self.onMouseMove = function(cb) {
        onMouseMoves.push(cb);
    };

    game.onload(function() {
        var canvas;

        canvas = document.getElementById('gamepanel');

        self.width = canvas.width;
        self.height = canvas.height;
        self.stage = new Stage(canvas);

        self.stage.onMouseMove = function(event) {
            _.each(onMouseMoves, function(onMouseMove) {
                onMouseMove(event);
            });
        };


        _.each(game.objects, function(object) {
            var newGraphics = [];

            _.each(object.graphics, function(graphics) {
                var g, w, h, shape, sheet;

                if (object.body) {
                    w = object.body.width * self.scale;
                    h = object.body.height * self.scale;
                } else {
                    w = graphics.width;
                    h = graphics.height;
                }
                if (graphics.id) {
                    if (!game.assets[graphics.id]) throw new Error('Unknown graphics id: ' + graphics.id);
                    shape = new Shape();
                    g = shape.graphics;
                    g.beginBitmapFill(game.assets[graphics.id]);
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
                self.stage.addChild(shape);
                newGraphics.push(shape);
                if (graphics.name) newGraphics[graphics.name] = shape;
            });
            object.graphics = newGraphics;
        });
    });

    game.tick(function() {
        _.each(game.objects, function(object) {
            var p = self.pos(object);
            _.each(object.graphics, function(graphics) {
                graphics.x = p.x + graphics.regX;
                graphics.y = p.y + graphics.regY;
                if (graphics.paddX) graphics.x += graphics.paddX;
                if (graphics.paddY) graphics.y += graphics.paddY;
                if (object.body) graphics.rotation = - (object.body.GetAngle() * 180 / Math.PI);
            });
        });

        self.stage.update();
    });
    return self;
})();

