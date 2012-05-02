(function() {
    events.on('objectCreate', function(object) {
        if (object.simpleanimation) {
            _.each(object.graphics, function(g) {
                g.onAnimationEnd = function() {
                    graphics.stage.removeChild(g);
                };
            });
        }
    });
})();

