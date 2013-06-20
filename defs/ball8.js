onball8 = function(ball, game) {
  var b = ball.body;
  b.ApplyImpulse(new b2Vec2(0, 100), b.GetWorldCenter());
};
