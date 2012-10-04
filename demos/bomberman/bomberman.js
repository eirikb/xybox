window.onload = function() {
    var progress = document.getElementById('progress');

    game.init('levels/level-1', function(count, total) {
        var progress = document.getElementById('progress');
        var bar = document.getElementById('bar');
        var percentage = Math.floor(count / total * 100);
        bar.style.width = percentage + '%';
        if (count === total) progress.style.display = 'none';
    });
};
