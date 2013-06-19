function Debugpanel(canvasId, game) {
  game.on('game:start', function() {
    var c = document.getElementById(canvasId);
    var ctx = c.getContext('2d');
    var dbgDraw = new b2DebugDraw();

    dbgDraw.m_drawScale = 10;
    dbgDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_centerOfMassBit);
    dbgDraw.SetSprite(ctx);
    game.world.SetDebugDraw(dbgDraw);

    game.d = dbgDraw;

    game.on('tick', function() {
      game.world.DrawDebugData();
    });
  });
}
