theBomb = function(game) {

  function rand(x) {
    return Math.floor(Math.random() * x);
  }

  function scale(x) {
    return Math.floor((x / game.scale) - 1);
  }

  function createBomb(x, y) {
    game.createItem({
      def: 'bomb',
      power: rand(7) + 3,
      body: {
        x: scale(x),
        y: scale(y)
      }
    });
  }

  game.on('tick', function() {
    _.each(game.itemByDef.bomb, function(bomb) {
      if (--bomb.timer <= 0) game.destroyItem(bomb);
    });
  });

  game.on('mouseDown', function(e) {
    createBomb(e.stageX, game.height - e.stageY);
  });
};
