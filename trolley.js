trolley = (function() {
    var world;

    function exp(a, b) {
        var opt;
        for (opt in b) {
            if (b.hasOwnProperty(opt)) {
                a[opt] = b[opt];
            }
        }
        return a;
    }

    function init() {
        world = new b2World(new b2Vec2(0.0, - 9.81), true);
        world.SetWarmStarting(true);
        return world;
    }

    function body(x, y, isStatic) {
        return (function() {
            var self = this,
            bodyDef = new b2BodyDef();

            if (isStatic) {
                bodyDef.type = b2Body.b2_staticBody;
            } else {
                bodyDef.type = b2Body.b2_dynamicBody;
            }
            bodyDef.position.Set(x, y);
            self.body = self.b = world.CreateBody(bodyDef);

            function fixture(shape, options) {
                fixtureDef = new b2FixtureDef();
                exp(fixtureDef, {
                    density: 1
                });
                exp(fixtureDef, options);
                fixtureDef.shape = shape;
		        self.body.CreateFixture(fixtureDef);
                return self;
            }

            self.box = function(localX, localY, width, height, options) {
                if (arguments.length === 3) options = width;
                if (arguments.length >= 2) {
                    height = localY;
                    width = localX;
                } else if (arguments.length === 1) {
                    options = localX;
                }

                var shape = new b2PolygonShape.AsBox(width, height);
                return fixture(shape, options);
            };
            self.circle = function(localX, localY, radius, options) {
                if (arguments.length  === 2) {
                    options = localY;
                    radius = localX;
                } else if (arguments.length === 1) {
                    radius = localX;
                }
                var shape = new b2CircleShape(radius);
                return fixture(shape, options);
            };

            return self;
        } ());
    }

    link = function(b1, b2) {
        var jd = new box2d.RevoluteJointDef();
        jd.anchorPoint.Set(b1.m_position.x, b1.m_position.y + 1);
        jd.body1 = b1;
        jd.body2 = b2;
        trolley.world.CreateJoint(jd);
    };

    createBridge = function(x, y, width) {
        var b1 = trolley.body(trolley.world, x, y).box(5, 2).create(),
        i = 1,
        b2;
        for (; i < 10; i++) {
            b2 = trolley.body(x + (i * 15), y).box(5, 2, {
                density: 20,
                friction: 0.5
            }).create();
            trolley.link(b1, b2);
            b1 = b2;
        }
        b2 = trolley.body(x + (i * 15), y).box(5, 2).create();
        trolley.link(b1, b2);
    };

    return {
        init: init,
        body: body,
        b: body
    };
})();

