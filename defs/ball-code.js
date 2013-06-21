onball4 = function(ball, game) {
  var way = 1;
  var g = ball.graphics[0];

  game.on('tick', function() {
    g.x += way * 4;

    if (g.x > 200) way = -1;
    else if (g.x < 50) way = 1;
  });
};
