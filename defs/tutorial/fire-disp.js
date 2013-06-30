onFireDisp = function(game) {

  function fire(x, y, type) {
    var item = game.createItem({
      def: 'fire',
      body: {
        x: x,
        y: y
      }
    });
    item.graphics[0].gotoAndPlay(type);
  }

  setInterval(function() {
    fire(6, 4, 'left');
    fire(7, 4, 'horizontal');
    fire(8, 4, 'core');
    fire(9, 4, 'horizontal');
    fire(10, 4, 'right');

    fire(8, 2, 'down');
    fire(8, 3, 'vertical');
    fire(8, 5, 'vertical');
    fire(8, 6, 'up');
  }, 1000);
};
