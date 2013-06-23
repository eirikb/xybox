theFire = function(game) {

  game.on('destroy:bomb', function(bomb) {
    var pos = game.posBox(bomb);
    addFire(bomb, pos.x, pos.y, 'core', bomb.power);
  });

  var ways = {
    left: [-1, 0],
    up: [0, 1],
    right: [1, 0],
    down: [0, -1]
  };

  function addFire(bomb, x, y, type, power) {
    power = power - 1;
    if (power <= 0) return;
    var playType = type;
    if (power > 1) {
      if (type === 'left' || type === 'right') playType = 'horizontal';
      if (type === 'up' || type === 'down') playType = 'vertical';
    }
    var f = game.createItem({
      def: 'fire',
      type: type,
      power: power,
      bomb: bomb,
      body: {
        x: x,
        y: y
      }
    });

    f.graphics[0].gotoAndPlay(playType);

    if (type === 'core') {
      _.each(ways, function(w, n) {
        addFire(bomb, x + w[0], y + w[1], n, power);
      });
      return;
    }
    var w = ways[type];
    addFire(bomb, x + w[0], y + w[1], type, power);
  }

  game.onCollide('fire', function(fire, b) {
    if (b.def === 'bomb') b.timer = 0;
  });
};
