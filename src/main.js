$(function() {
  prettyPrint();

  for (var i = 1; i <= 6; i++) {
    var game = new xybox.Game();
    game.init('ball' + i, 'defs/ball' + i + '.json');
    new Debugpanel('ball6-debug', game);
  }
});
