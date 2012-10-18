(function() {
    var self = {};

    events.on('onload', function(assets) {
        var c = document.getElementById('debugpanel'),
        ctx = c.getContext('2d');
        var dbgDraw = new b2DebugDraw();
        dbgDraw.m_drawScale = 10;
        dbgDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
        dbgDraw.SetSprite(ctx);
        physics.world.SetDebugDraw(dbgDraw);

        game.d = dbgDraw;
    });

    events.on('tick', function() {
        physics.world.DrawDebugData();
    });

    return self;
})();

