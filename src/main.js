$(function() {
  prettyPrint();

  for (var i = 1; i <= 7; i++) {
    var game = new xybox.Game();
    game.init('ball' + i, 'defs/ball' + i + '.json');
  }
});
