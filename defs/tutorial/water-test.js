initWaterTest = function(game) {


  function scale(x) {
    return Math.floor((x / game.scale) - 1);
  }

  var items = [];
  var pos = 0;


  function createItem(e) {
    var x = e.stageX;
    var y = game.height - e.stageY;

    items.push(game.createItem({
      def: 'water',
      body: {
        x: scale(x),
        y: scale(y)
      }
    }));
  }

  game.on('mouseDown', function(e) {
    createItem(e);
  })

  game.on('mouseMove', function(e) {
    pos = [e.stageX - 20, e.stageY - 20];
  });

  function dir(item, x, y) {
    item.body.direction = {
      x: x,
      y: y
    };
  }

  game.on('tick', function() {
    _.each(items, function(item) {
      var p = game.pos(item);
      var diff = pos[0] - p.x;
      if (Math.abs(diff) > 10) return dir(item, diff / Math.abs(diff), 0);
      var diff = pos[1] - p.y;
      if (Math.abs(diff) > 10) return dir(item, 0, -diff / Math.abs(diff));
      dir(item, 0, 0);
    });
  });
};
