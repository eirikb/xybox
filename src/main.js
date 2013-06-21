$(function() {
  prettyPrint();

  $('canvas.ball').each(function() {
    var id = $(this).attr('id');
    var game = new xybox.Game();
    game.init(id, 'defs/' + id + '.json');
  });
});
