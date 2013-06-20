$(function() {
  prettyPrint();

  for (var i = 1; i <= 8; i++) {
    window.game = new xybox.Game();
    game.init('ball' + i, 'defs/ball' + i + '.json');
  }

  _.each(['static', 'anim', 'body-static', 'body-anim'], function(type) {
    var game = new xybox.Game();
    game.init('ball-cs-' + type, 'defs/ball-cs-' + type + '.json');
  });
});
