(function() {

    events.on('ready-level-1', function() {
        bomberman.box('brick', 7, 7, 7, 7);
        bomberman.box('block', 20, 7, 11, 7);
        game.start();
    });
})();
