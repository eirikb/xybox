// Graphics using EaselJS ( https://github.com/CreateJS/EaselJS/ )
function Graphics(core) {
  var self = this;
  var stage;

  function draw(item) {
    var p = core.pos(item);
    _.each(item.graphics, function(graphics) {
      graphics.x = p.x; // + (graphics.scaleX * graphics.w) / 2;
      graphics.y = p.y; // + (graphics.scaleY * graphics.h) / 2;
      if (graphics.paddX) graphics.x += graphics.paddX;
      if (graphics.paddY) graphics.y += graphics.paddY;
      if (item.body) graphics.rotation = -(item.body.GetAngle() * 180 / Math.PI);
    });
  }

  self.createItem = function(item) {
    createGraphics(item);
    _.each(item.graphics, function(g) {
      if (g.loop) {
        g.onAnimationEnd = function() {
          g.loop--;
          if (g.loop === 0) {
            if (item.body) core.destroyItem(item);
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
      if (!graphics.image) throw new Error('Missing graphics image: ' + item.def);
      var img = core.assets[graphics.image];
      if (!img) throw new Error('Unknown graphics image: ' + graphics.image);
      var shape;

      var w, h;

      if (graphics.animations) {
        w = graphics.width || graphics.frames.width;
        h = graphics.height || graphics.frames.height;
        if (item.body) {
          w = item.body.width * core.scale;
          h = item.body.height * core.scale;
        }
        graphics.images = [img.src];
        var sheet = new createjs.SpriteSheet(graphics);
        shape = new createjs.BitmapAnimation(sheet);
        if (item.animation) graphics.animation = item.animation;
        if (!graphics.animation) graphics.animation = 'default';
        var doPlay = !! graphics.animations[graphics.animation];
        var call = 'gotoAnd' + (doPlay ? 'Play' : 'Stop');
        shape[call](graphics.animation);
        shape.width = w;
        shape.height = h;
        shape.scaleX = w / graphics.frames.width;
        shape.scaleY = h / graphics.frames.height;
      } else {
        w = graphics.width || img.width;
        h = graphics.height || img.height;
        if (item.body) {
          w = item.body.width * core.scale;
          h = item.body.height * core.scale;
        }
        shape = new createjs.Shape();
        var g = shape.graphics;
        g.beginBitmapFill(img);
        if (graphics.type === 'repeat') {
          g.drawRect(0, 0, w, h);
        } else {
          g.drawRect(0, 0, img.width, img.height);
          shape.scaleX = w / img.width;
          shape.scaleY = h / img.height;
        }
        shape.width = w;
        shape.height = h;
      }

      if (item.rotation) shape.rotation = item.rotation;
      shape.paddX = graphics.paddX;
      shape.paddY = graphics.paddY;

      shape.regX = shape.w / 2;
      shape.regY = shape.h / 2;

      shape.loop = graphics.loop;

      if (graphics.zindex) stage.addChildAt(shape, graphics.zindex);
      else stage.addChild(shape);
      newGraphics.push(shape);
      if (graphics.name) newGraphics[graphics.name] = shape;
    });
    item.graphics = newGraphics;
  }

  self.init = function() {
    core.width = core.canvas.width;
    core.height = core.canvas.height;
    core.center = {
      x: core.width / 2,
      y: core.height / 2
    };
    stage = core.stage = new createjs.Stage(core.canvas);

    stage.onMouseMove = function(event) {
      core.trigger('mouseMove', event);
    };
    stage.onMouseDown = function(event) {
      core.trigger('mouseDown', event);
    };
    stage.onMouseUp = function(event) {
      core.trigger('mouseUp', event);
    };
  };


  self.itemDestroy = function(item) {
    _.each(item.graphics, function(graphics) {
      stage.removeChild(graphics);
    });
  };

  core.on('tick', 2, function() {
    _.each(core.actives, draw);

    for (var i = 0; i < stage.getNumChildren(); i++) {
      var shape = stage.getChildAt(i);
      var x = shape.x + stage.x;
      var y = shape.y + stage.y;
      shape.visible = x >= 0 && x < core.canvas.width + shape.width && y >= 0 && y < core.canvas.height + shape.height;
    }

    stage.update();
  });
}
