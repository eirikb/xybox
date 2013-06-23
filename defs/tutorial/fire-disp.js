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
    fire(1, 4, 'left');
    fire(2, 4, 'horizontal');
    fire(3, 4, 'core');
    fire(4, 4, 'horizontal');
    fire(5, 4, 'right');

    fire(3, 2, 'down');
    fire(3, 3, 'vertical');
    fire(3, 5, 'vertical');
    fire(3, 6, 'up');
  }, 1000);
};
