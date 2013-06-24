initBlocks = function(game) {

  function create(type, x, y) {
    last = game.createItem({
      def: type,
      body: {
        x: x * 2,
        y: y * 2
      }
    });
  }

  var width = game.width / game.scale / 2;
  var height = game.height / game.scale / 2;

  _(width).times(function(x) {
    create('block', x, 0);
    create('block', x, height - 1);
  });

  _(height).times(function(y) {
    create('block', 0, y);
    create('block', width - 1, y);
  });

  _.each(_.range(1, height - 1), function(y) {
    _.each(_.range(1, width - 1), function(x) {
      var addBrick = Math.random() < 0.5;

      if (x % 2 === 0 && y % 2 === 0) create('block', x, y);
      if ((x < 3 || x > width - 4) && (y < 3 || y > height - 4)) return;

      if (addBrick && (x % 2 === 1 || y % 2 === 1)) create('brick', x, y);
    });
  });
};
