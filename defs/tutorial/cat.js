oncat = function(cat, game) {

  var keys = ['w', 'a', 's', 'd'];
  var dirs = {
    '65': [-1, 0, 'left'],
    '68': [1, 0, 'right'],
    '87': [0, 1, 'up'],
    '83': [0, -1, 'down']
  };

  var g = cat.graphics[0];
  var dir = {};
  cat.body.direction = dir;

  game.keys.down(keys, function(e) {
    var d = dirs['' + e.keyCode];
    if (d[0] === dir.x && d[1] === dir.y) return;

    dir.x = d[0];
    dir.y = d[1];

    g.gotoAndPlay(d[2]);
  }).up(keys, function(e) {
    var d = dirs['' + e.keyCode];
    if (d[0] !== 0) dir.x = 0;
    if (d[1] !== 0) dir.y = 0;

    if (dir.x === 0 && dir.y === 0) g.gotoAndStop();
  });
};
