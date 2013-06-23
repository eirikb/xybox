theBomb = function(game) {

  function rand(wh) {
    return Math.floor(Math.random() * ((wh / game.scale) - 1));
  }

  setInterval(function() {
    game.createItem({
      def: 'bomb',
      power: Math.floor(Math.random() * 7) + 3,
      body: {
        x: rand(game.width),
        y: rand(game.height)
      }
    });
  }, 1000);

  game.on('tick', function() {
    _.each(game.itemByDef.bomb, function(bomb) {
      if (--bomb.timer <= 0) game.destroyItem(bomb);
    });
  });
};
