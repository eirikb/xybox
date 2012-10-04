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
