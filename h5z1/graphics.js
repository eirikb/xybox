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
        });

        /*
        var shape = new Shape();
        var g = shape.graphics;
        g.beginBitmapFill(level.player.graphics.top);
            w = level.player.body.width * scale,
            h = level.player.body.height * scale;
        g.draw(0,0,

        level.player.graphics.top = 
        */
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
    /*
    var width = 500,
    height = 400,
    scale = 30,

    var player, bottom, surface;

    self.width = width;
    self.height = width;

    self.pos = function(body) {
        var pos = trolley.pos(body);
        return {
            x: pos.x * scale,
            y: draw.height - pos.y * scale - body.height * scale
        };
    };

    function createPlayer() {
        var pos = self.pos(game.player);

        player = {
            topCycle: _.range(4).map(function(x) {
                return [x * 30, 0, 10];
            }).concat(_.range(4).map(function(x) {
                return [x * 30, 30, 10];
            })),
            bottomCycle: _.range(5).map(function(x) {
                return [x * 30, 60, 5];
            }).concat(_.range(5).map(function(x) {
                return [x * 30, 90, 5];
            })),
            top: 0,
            bottom: 0,
        };
        _.each(player, function(val, key) {
            if (key.match(/Cycle$/)) {
                player[key] = scene.Cycle(val);
            } else {
                player[key] = scene.Sprite('img/player.png');
                player[key].size(30, 30);
                player[key + 'Cycle'].addSprite(player[key]);
            }
        });
    }

    function drawPlayer() {
        var way, index, angle, mouse = input.mouse.position,
        pos = self.pos(game.player),
        mouseX = mouse.x - pos.x,
        mouseY = mouse.y - pos.y,
        rightDir = mouseX >= 0,
        y = rightDir ? 0: 1,
        x = 0;

        if (rightDir) mouseY *= - 1;
        angle = mouseX / mouseY;

        if (angle < - 2 || angle > 5) x = 0;
        else if (angle < 0) x = 2;
        else if (angle > 1) x = 1;
        else x = 3;

        if (!rightDir) x += 4;

        player.top.setX(pos.x);
        player.top.setY(pos.y);
        player.bottom.setX(pos.x);
        player.bottom.setY(pos.y + (scale * game.player.height / 2));

        player.topCycle.go(x);
        way = game.player.way;
        if (way !== 0) {
            player.bottomCycle.next();
            index = player.bottomCycle.currentTripletIndex;
            if (index === 0) player.bottomCycle.next();

            if (way < 0 && index === 0) player.bottomCycle.reset().next(5,true);
            //if (way < 0 && index >= 5) player.bottomCycle.go(6);
            //if (way > 0 && index >= 5) player.bottomCycle.go(1);
        } else {
            player.bottomCycle.go(0);
        }
            index = player.bottomCycle.currentTripletIndex;
            console.log(index)

        player.top.update();
        player.bottom.update();
    }

    function createBoxes() {
        _.each(game.boxes, function(box) {
            var sprite = scene.Sprite('img/box.png');
            box.sprite = sprite;
        });
    }

    function drawBoxes() {
        _.each(game.boxes, function(box) {
            var pos = self.pos(box),
            sprite = box.sprite;

            sprite.setX(pos.x);
            sprite.setY(pos.y);
            sprite.setAngle( - box.GetAngle());

            sprite.update();
        });
    }

    function createBottoms() {
        _.each(game.bottoms, function(bottom) {
            var sprite = scene.Sprite('img/ground.png');
            sprite.setW(trolley.pos(bottom).width * scale);
            bottom.sprite = sprite;
        });
    }

    function drawBottoms() {
        _.each(game.bottoms, function(bottom) {
            var pos = self.pos(bottom),
            sprite = bottom.sprite;
            sprite.setX(pos.x);
            sprite.setY(pos.y);
            sprite.update();
        });
    }

    self.onload = function() {
        createPlayer();
        createBoxes();
        createBottoms();

        surface = sjs.SrollingSurface(scene, scene.w, scene.h, function(layer, x, y) {
            for (var x = 0; x < (layer.w / 48); x++) {
                for (var y = 0; y < (layer.h / 48); y++) {
                    //var tile = random_from_list(tile_list);
                    // we need to update the position as the Sprites are shared
                    //tile.position(48 * x, 48 * y);
                    //tile.canvasUpdate(layer);
                }
            }
        });
    };

    self.tick = function() {
        drawPlayer();
        drawBoxes();
        drawBottoms();
        surface.move( - 1 * ticker.lastTicksElapsed, - 1 * ticker.lastTicksElapsed);
        surface.update();
    };
    */

    return self;
})();

