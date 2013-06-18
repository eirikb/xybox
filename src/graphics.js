// Graphics using EaselJS ( https://github.com/CreateJS/EaselJS/ )
function Graphics(game, center) {
  var self = this;
  var stage;

  function draw(item) {
    var p = game.pos(item);
    _.each(item.graphics, function(graphics) {
      graphics.x = p.x + graphics.regX;
      graphics.y = p.y + graphics.regY;
      if (graphics.paddX) graphics.x += graphics.paddX;
      if (graphics.paddY) graphics.y += graphics.paddY;
      if (item.body) graphics.rotation = -(item.body.GetAngle() * 180 / Math.PI);
    });
  }

  game.pos = function(item) {
    var pos;

    if (item.body) {
      pos = trolley.pos(item.body);
      return {
        x: pos.x * game.scale,
        y: game.height - pos.y * game.scale - item.body.height * game.scale
      };
    } else {
      return item;
    }
  };

  self.createItem = function(item) {
    createGraphics(item);
    _.each(item.graphics, function(g) {
      if (g.loop) {
        g.onAnimationEnd = function() {
          g.loop--;
          if (g.loop === 0) {
            if (item.body) game.destroyItem(item);
            else stage.removeChild(g);
            return;
          }
          g.gotoAndPlay(g.currentAnimation);
        };
      }
    });
    draw(item);
  };

  function createGraphics(item) {
    var newGraphics = [];

    _.each(item.graphics, function(graphics) {
      var w, h;
      if (item.body) {
        w = item.body.width * game.scale;
        h = item.body.height * game.scale;
      } else {
        w = graphics.width;
        h = graphics.height;
      }


      if (!graphics.image) throw new Error('Missing graphics image: ' + item.def);
      var img = center.assets[graphics.image];
      if (!img) throw new Error('Unknown graphics image: ' + graphics.image);
      var shape;

      if (!w) w = img.width;
      if (!h) h = img.height;

      if (graphics.animations) {
        graphics.images = [img.src];
        var sheet = new createjs.SpriteSheet(graphics);
        shape = new createjs.BitmapAnimation(sheet);
        if (item.animation) graphics.animation = item.animation;
        if (!graphics.animation) graphics.animation = 'default';
        var doPlay = !! graphics.animations[graphics.animation];
        var call = 'gotoAnd' + (doPlay ? 'Play' : 'Stop');
        shape[call](graphics.animation);
      } else {
        shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginBitmapFill(img);
        g.drawRect(0, 0, w, h);
        shape.cache(0, 0, w, h);
      }

      if (item.rotation) shape.rotation = item.rotation;
      shape.paddX = graphics.paddX;
      shape.paddY = graphics.paddY;
      shape.regX = w / 2;
      shape.regY = h / 2;
      shape.loop = graphics.loop;
      shape.width = w;
      shape.height = h;

      if (graphics.zindex) stage.addChildAt(shape, graphics.zindex);
      else stage.addChild(shape);
      newGraphics.push(shape);
      if (graphics.name) newGraphics[graphics.name] = shape;
    });
    item.graphics = newGraphics;
  }

  self.init = function() {
    game.width = game.canvas.width;
    game.height = game.canvas.height;
    game.center = {
      x: game.width / 2,
      y: game.height / 2
    };
    stage = game.stage = new createjs.Stage(game.canvas);

    stage.onMouseMove = function(event) {
      game.trigger('mouseMove', event);
    };
    stage.onMouseDown = function(event) {
      game.trigger('mouseDown', event);
    };
    stage.onMouseUp = function(event) {
      game.trigger('mouseUp', event);
    };
  };


  self.itemDestroy = function(item) {
    _.each(item.graphics, function(graphics) {
      stage.removeChild(graphics);
    });
  };

  game.on('tick', 2, function() {
    _.each(game.actives, draw);

    for (var i = 0; i < stage.getNumChildren(); i++) {
      var shape = stage.getChildAt(i);
      var x = shape.x + stage.x;
      var y = shape.y + stage.y;
      shape.visible = x >= 0 && x < game.canvas.width + shape.width && y >= 0 && y < game.canvas.height + shape.height;
    }

    stage.update();
  });
}
