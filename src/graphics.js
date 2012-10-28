// Graphics using EaselJS ( https://github.com/CreateJS/EaselJS/ )
graphics = (function() {
    var self;

    self = {};
    self.scale = 10;

    events.on('onload', function() {
        self.scale = meta.scale || self.scale;
    });

    function draw(object) {
        var p = self.pos(object);
        _.each(object.graphics, function(graphics) {
            graphics.x = p.x + graphics.regX;
            graphics.y = p.y + graphics.regY;
            if (graphics.paddX) graphics.x += graphics.paddX;
            if (graphics.paddY) graphics.y += graphics.paddY;
            if (object.body) graphics.rotation = -(object.body.GetAngle() * 180 / Math.PI);
        });
    }

    self.pos = function(object) {
        var pos;

        if (object.body) {
            pos = trolley.pos(object.body);
            return {
                x: pos.x * self.scale,
                y: self.height - pos.y * self.scale - object.body.height * self.scale
            };
        } else {
            return object;
        }
    };

    self.createGraphics = function(object) {
        var newGraphics = [];

        _.each(object.graphics, function(graphics) {
            var w, h;
            if (object.body) {
                w = object.body.width * self.scale;
                h = object.body.height * self.scale;
            } else {
                w = graphics.width;
                h = graphics.height;
            }

            if (!graphics.image) throw new Error('Missing graphics id: ' + object.def);
            if (!game.assets[graphics.image]) throw new Error('Unknown graphics id: ' + graphics.image);
            var shape;
            if (!graphics.animations) {
                shape = new Shape();
                var g = shape.graphics;
                g.beginBitmapFill(game.assets[graphics.image]);
                g.drawRect(0, 0, w, h);
            } else {
                graphics.images = [game.assets[graphics.image].src];
                var sheet = new SpriteSheet(graphics);
                shape = new BitmapAnimation(sheet);
                if (object.animation) graphics.animation = object.animation;
                if (!graphics.animation) graphics.animation = 'default';
                shape.gotoAndPlay(graphics.animation);
            }
            if (object.rotation) shape.rotation = object.rotation;
            shape.paddX = graphics.paddX;
            shape.paddY = graphics.paddY;
            shape.regX = w / 2;
            shape.regY = h / 2;
            shape.loop = graphics.loop;
            if (meta.graphics) {
                shape.scaleX = meta.graphics.scaleX || 1;
                shape.scaleY = meta.graphics.scaleY || 1;
            }
            if (graphics.zindex) self.stage.addChildAt(shape, graphics.zindex);
            else self.stage.addChild(shape);
            newGraphics.push(shape);
            if (graphics.name) newGraphics[graphics.name] = shape;
        });
        object.graphics = newGraphics;
    };

    events.on('objectCreate', function(object) {
        self.createGraphics(object);
        _.each(object.graphics, function(g) {
            if (g.loop) {
                g.onAnimationEnd = function() {
                    g.loop--;
                    if (g.loop === 0) {
                        if (object.body) game.destroyObject(object);
                        else graphics.stage.removeChild(g);
                        return;
                    }
                    g.gotoAndPlay(g.currentAnimation);
                };
            }
        });
        draw(object);
    });

    events.on('objectDestroy', function(object) {
        _.each(object.graphics, function(graphics) {
            self.stage.removeChild(graphics);
        });
    });

    events.on('onload', function() {
        var canvas;

        canvas = document.getElementById('gamepanel');

        self.width = canvas.width;
        self.height = canvas.height;
        self.center = {
            x: self.width / 2,
            y: self.height / 2
        };
        self.stage = new Stage(canvas);

        self.stage.onMouseMove = function(event) {
            events.trigger('mouseMove', event);
        };
        self.stage.onMouseDown = function(event) {
            events.trigger('mouseDown', event);
        };
        self.stage.onMouseUp = function(event) {
            events.trigger('mouseUp', event);
        };
    });

    events.on('tick', 2, function() {
        _.each(game.actives, draw);

        self.stage.update();
    });
    return self;
})();
