bomberman = function(level) {
    if (!level) return;
    var progress = document.getElementById('progress');
    var bar = document.getElementById('bar');
    bar.style.width = '0%';
    progress.style.display = '';

    game.init('levels/level-' + level, function(count, total) {
        var percentage = Math.floor(count / total * 100);
        bar.style.width = percentage + '%';
        if (count === total) progress.style.display = 'none';
    });
};
window.onload = function() {
    bomberman(1);
};

bomberman.box = function(type, startX, startY, width, height) {
    function c(x, y) {
        game.createObject({
            def: type,
            body: {
                x: x,
                y: y
            }
        });
    }
    _.times(width, function(x) {
        x += startX;
        _.each([startY, startY + height - 1], function(y) {
            c(x, y);
        });
    });
    _.times(height - 2, function(y) {
        y += startY + 1;
        _.each([startX, startX + width - 1], function(x) {
            c(x, y);
        });
    });
};
