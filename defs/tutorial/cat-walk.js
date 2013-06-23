catWalk = function(cat, game) {

  var keys = ['w', 'a', 's', 'd'];
  var dirs = {
    '65': [-1, 0, 'left'],
    '68': [1, 0, 'right'],
    '87': [0, 1, 'up'],
    '83': [0, -1, 'down']
  };

  var dir = {};
  cat.body.direction = dir;

  game.keys.down(keys, function(e) {
    var d = dirs['' + e.keyCode];
    dir.x = d[0];
    dir.y = d[1];
  }).up(keys, function(e) {
    var d = dirs['' + e.keyCode];
    if (d[0] !== 0) dir.x = 0;
    if (d[1] !== 0) dir.y = 0;
  });
};
