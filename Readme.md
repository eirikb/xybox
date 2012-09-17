# xybox

## Install

For the lazy:

```HTML
<script src="https://raw.github.com/eirikb/xybox/master/xybox-all.min.js"></script>
```

Or:

```Bash
bower install xybox
```

## Usage

**Init**:

```JavaScript
window.onload = function() {
    game.init('level1', function() {
        console.log('Ready');
    });
};
```

The *level1* in previous example is a definition.  
xybox is built to read these definitions from JSON files and load other definition from these.  
**meta.json** is always loaded.  
For now see [gh-pages of planet cute demo](https://github.com/eirikb/xybox/tree/gh-pages/demos/planet-cute).

## Built on

*  [EaselJS](https://github.com/CreateJS/EaselJS) - Graphics and animations (canvas).
*  [PreloadJS](https://github.com/CreateJS/PreloadJS) - Preloading JSON and JavaScript files.
*  [Box2d.js](https://github.com/HBehrens/box2d.js) - JavaScript port of Box2D.
*  [Trolley](https://github.com/eirikb/trolley) - Utility library for Box2d.js, also used to build box bodies from JSON.
*  [Kibo](https://github.com/marquete/kibo) - Keyboard input.
