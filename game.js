//taken from Gist: https://gist.github.com/paulirish/1579671

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

;(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 17 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {

    window.clearTimeout(id);
  };
}());
// Manages the ticks for a Game Loop

window.gameTime =  {
  lastTime     : Date.now(),
  frameTime    : 0 ,
  typicalFrameTime : 20,
  minFrameTime : 12 ,
  time         : 0
};

// move the clock one tick.
// return true if new frame, false otherwise.
window.gameTime.tick = function() {
  var now = Date.now();
  var delta = now - this.lastTime;

  if (delta < this.minFrameTime ) {
    return false;
  }

  if (delta > 2 * this.typicalFrameTime) { // +1 frame if too much time elapsed
     this.frameTime = this.typicalFrameTime;
  } else {
    this.frameTime = delta;
  }

  this.time += this.frameTime;
  this.lastTime = now;

  return true;
};

window.camera = (function(){

  var pars = [],
    t = 0.1,
    currT = 0,
    pos = [0, 0];

  function rnd(from, to){
    return Math.floor((Math.random()*to)+from);
  }

  function rndM(){
    return (Math.round(Math.random()) ? 1 : -1);
  }

  return {
    pos: function(){
      return [pos[0], pos[1]];
    },
    shake: function(powa){
      powa = powa || 3;
      currT = t;
      pos = [ rnd(-powa, powa), rnd(-powa, powa) ];
    },
    update: function(dt){
      dt = dt/1000;
      currT -= dt;

      if (currT < 0){
        pos = [0, 0];
      }
      else {
        pos[0] *= rndM();
        pos[1] *= rndM();
      }
    }
  }

})();

window.particles = (function(){

  var pars = [],
    //gravity = [5, 40],
    gravity = [2, 10],
    ctx,
    size;

  function rnd(from, to){
    return Math.floor((Math.random()*to)+from);
  }

  function rndM(){
    return (Math.round(Math.random()) ? 1 : -1);
  }

  function hexToRGB(c){
    if (c.indexOf('#') === -1) return c;

    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}

    return [ hexToR(c), hexToG(c), hexToB(c), 1 ];
  }

  return {
    init: function(_ctx, _size){
      ctx = _ctx;
      size = _size;
      pars = [];
    },
    create: function(pos, qty, color){
      var c = hexToRGB(color);

      for (var i=0; i < qty; i++){

        var vel = [rnd(10, 30)*rndM(), rnd(10, 30)*-1];

        pars.push({
          pos: [
            pos[0] + (rnd(1, 3)*rndM()),
            pos[1] + (rnd(1, 3)*rndM())
          ],
          vel: vel,
          c: c,
          t: 2,
        });
      }
    },
    update: function(dt){
      dt = dt/500;

      for(var i=0; i < pars.length; i++){
        var p = pars[i];

        p.t -= dt;

        p.vel[0] += gravity[0] * dt;
        p.vel[1] += gravity[1] * dt;

        p.pos[0] += p.vel[0] * dt;
        p.pos[1] += p.vel[1] * dt;

        if (p.pos[1] > size.h || p.t < 0){
          pars.splice(i, 1);
        }
        else {
          p.c[3] = p.t.toFixed(2);
        }
      }
    },
    draw: function(dt){
      for(var i=0; i < pars.length; i++){
        var p = pars[i];
        ctx.save();
        ctx.fillStyle = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',' + p.c[3] + ')';
        ctx.fillRect(p.pos[0], p.pos[1], 3, 3);
        ctx.restore();
      }
    }
  }

})();
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


function Controls() { throw 'Controls class is Static.'; };
Controls.Left = "Left";
Controls.Right = "Right";
Controls.Shoot = "Shoot";

function Keyboard() { throw 'KeyboardCode class is Static.'; };
Keyboard.Left = 37;
Keyboard.Right = 39;
Keyboard.Up = 38;
Keyboard.Down = 40;
Keyboard.Space = 32;

/**
 * @author pjnovas
 */

function ImageMapper() { throw 'ImageMapper class is Static.'; };
ImageMapper.Ship = function(){
  return [
    [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0]
  ];
};
ImageMapper.ShipShoot = function(){
  return [
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1]
  ];
};
ImageMapper.Invasion = function(){
  return [
    [2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,1,2,1,1,1,2,2,2,1,2],
    [2,2,1,1,2,1,2,1,2,2,1,1,2],
    [2,1,2,1,2,1,2,1,2,1,2,1,2],
    [2,1,1,1,2,1,2,1,2,1,1,1,2],
    [2,2,2,1,2,1,1,1,2,2,2,1,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2]
  ];
};
ImageMapper.AlienCrab = function(){
  return [
    [0,0,1,0,0,0,0,0,1,0,0],
    [3,0,0,1,0,0,0,1,0,0,3],
    [3,0,0,1,0,0,0,1,0,0,3],
    [3,0,1,1,1,1,1,1,1,0,3],
    [3,0,1,0,1,1,1,0,1,0,3],
    [3,1,1,1,1,1,1,1,1,1,3],
    [2,1,1,1,1,1,1,1,1,1,2],
    [2,0,1,1,1,1,1,1,1,0,2],
    [2,0,1,1,1,1,1,1,1,0,2],
    [2,0,1,0,0,0,0,0,1,0,2],
    [2,0,1,0,0,0,0,0,1,0,2],
    [0,3,0,2,2,0,2,2,0,3,0]
  ];
};
ImageMapper.AlienSquid = function(){
  return [
    [0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,1,0,3,0,0,0,3,0,1,0],
    [3,0,1,0,3,0,3,0,1,0,3]
  ];
};
ImageMapper.DeadAlien = function(){
  return [
    [1,0,0,0,0,0,0,0,0,0,1],
    [0,1,0,0,0,1,0,0,0,1,0],
    [0,0,1,0,0,1,0,0,1,0,0],
    [0,0,0,1,0,1,0,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,1,0,1,0,0,0],
    [0,0,1,0,0,1,0,0,1,0,0],
    [0,1,0,0,0,1,0,0,0,1,0],
    [1,0,0,0,0,1,0,0,0,0,1]
  ];
};
ImageMapper.AlienShoot = function(){
  return [
    [0,1,0],
    [1,0,0],
    [0,1,0],
    [0,0,1],
    [0,1,0],
    [1,0,0],
    [0,1,0]
  ];
};
/*ImageMapper.Shield = function(){
  return [ //FERNET JS
    [1,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0],
    [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,0,1,1,1],
    [1,0,0,0,1,0,0,0,1,1,0,0,1,0,1,1,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1],
    [1,0,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,1,1,0,0,1,0,0,0,1,1,0,0,1,1,1]
  ];
};*/
ImageMapper.Shield = function(){
  return [ //NOT FOUND
    [1,0,0,1,0,1,1,1,0,1,1,1,0,0,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,1,0],
    [1,1,0,1,0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1],
    [1,1,1,1,0,1,0,1,0,0,1,0,0,0,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1],
    [1,0,0,1,0,1,1,1,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,0,1,1,1,0,1,0,0,1,0,1,1,0]
  ];
};
ImageMapper.ShieldBrick = function(){
  return [
    [
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1],
      [1,1,1,1,1,1]
    ],
    [
      [0,1,1,1,0,1],
      [1,1,1,0,0,0],
      [1,1,0,1,1,0],
      [0,0,1,0,1,1],
      [1,0,0,1,0,1],
      [1,1,0,0,1,1]
    ],
    [
      [0,0,0,1,0,1],
      [0,0,0,0,0,0],
      [1,0,0,1,0,0],
      [0,0,1,0,1,1],
      [1,0,0,1,0,1],
      [1,1,0,0,0,0]
    ]
  ];
};





function ImageCreator(){ throw 'ImageCreator class is Static.'; };

ImageCreator.getImages = function(options){

  var images = [];
  var bricks = [];

  // B - Get parameters ---------------------------------

  var mapper = options.mapper || [];
  var w = options.width || 100;
  var h = options.height || 100;

  var states = options.states || [];
  var bSize = options.brickSize || 5;

  var color = options.color || '#000';

  // E - Get parameters ---------------------------------


  // B - Create CANVAS to render ------------------------

  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d');
  //TODO: delete element

  // E - Create CANVAS to render ------------------------


  // B - Create image from mapper -----------------------

  function buildBricks(){
    var arrLen = mapper.length;

    for(var i=0; i< arrLen; i++){
      var colLen = mapper[i].length;

      for(var j=0; j< colLen; j++){
        var val = mapper[i][j];

        if (val){
          var b = new Brick({
            ctx: ctx,
            x: (j * bSize),
            y: (i * bSize),
            width: bSize,
            height: bSize,
            color: color,
            value: val
          });

          bricks.push(b);
        }
      }
    }
  }

  // E - Create image from mapper -----------------------


  // B - Draw on canvas context and get image -----------

  function createImage(state){
    ctx.clearRect(0, 0, w, h);

    var bLen = bricks.length;
    for(var i=0; i< bLen; i++){
      if (bricks[i].value === 1 || bricks[i].value === state)
        bricks[i].draw();
    }

    var imgData = canvas.toDataURL("image/png");

    var image = new Image();
    image.src = imgData;

    images.push(image);
  }

  // E - Draw on canvas context and get image -----------


  //Run the build
  buildBricks();

  //Create all images for each state
  for(var i=0; i< states.length; i++){
    createImage(states[i]);
  }

  // destroy all bricks created
  var i = bricks.length - 1;
  do{ bricks[i] = null; } while(i--);

  return images;
}



var DrawableElement = Class.extend({
  init: function(options){
    this.ctx = (options.ctx) ? options.ctx : null; // throw "must provide a Canvas Context";

    this.size = {
      width: options.width || 0,
      height: options.height || 0
    };

    this.position = {
      x: options.x || 0,
      y: options.y || 0
    };

    this.brickSize = options.brickSize || 1;
    this.color = options.color || '#000';

    this.bricks = [];

    this.onDestroy = options.onDestroy || function(){};
  },
  build: function(){

  },
  update: function(){

  },
  draw: function(img){
    if (this.ctx != null)
      this.ctx.drawImage(img,
        this.position.x + window.camera.pos()[0],
        this.position.y + window.camera.pos()[1]);
  },
  destroy: function(){
    this.ctx = null;

    if (this.size != null) {
      this.size.width = null;
      this.size.height = null;
      this.size = null;
    }

    if (this.position != null) {
      this.position.x = null;
      this.position.y = null;
      this.position = null;
    }

    this.brickSize = null;
    this.color = null;

    var bricks = this.bricks;
    if (bricks != null) {
      var bricksL = bricks.length;
      for(var i=0; i< bricksL; i++)
        bricks[i] = null;

      this.bricks = null;
    }

    //if (this.onDestroy) this.onDestroy(this);
  }
});

/* TEMPLATE for Inheritance

var DrawableElement = Class.extend({
  init: function(options){
    this._super(options);

  },
  build: function(){

  },
  update: function(){

  },
  draw: function(){

  },
  destroy: function(){

  }
});

*/


var Shoot = DrawableElement.extend({
  init: function(options){
    this._super(options);

    this.MOVE_FACTOR = 5;
    this.dir = options.dir;

    this.shootImage = options.shootImage;

    this.collateBricks = options.collateBricks;
    this.collateAliens = options.collateAliens;

    this.timer = null;
  },
  build: function(){

  },
  update: function(dt){
    var dir = this.dir;
    var vel = this.MOVE_FACTOR;

    this.position.y += (vel * dir);

    if(this.hasCollision()){
      this.collided();
      return;
    }
  },
  draw: function(){
    this._super(this.shootImage);
  },
  collided: function(){
    this.destroy();
  },
  destroy: function(){
    clearInterval(this.timer);

    this.collateBricks = null;
    this.collateAliens = null;

    this.onDestroy(this);

    this._super();
  },
  hasCollision: function(){
    var sX = this.position.x;
    var sY = this.position.y;

    if (sY < 0 || sY > 400)
      return true;

    function checkCollision(arr){
      if (!arr){
        return false;
      }

      var cb = arr;
      var cbLen = cb.length;

      for(var i=0; i< cbLen; i++){
        var cbO = cb[i];

        var cbL = cbO.position.x;
        var cbT = cbO.position.y;
        var cbR = cbL + cbO.size.width;
        var cbD = cbT + cbO.size.height;

        if (sX >= cbL && sX <= cbR && sY >= cbT && sY <= cbD && !cbO.destroyed){
          arr[i].collided();
          return true;
        }
      }

      return false;
    }

    if (checkCollision(this.collateBricks)) return true;
    if (this.collateAliens && checkCollision(this.collateAliens)) return true;
  }
});

var Ship = DrawableElement.extend({
  init: function(options){
      this._super(options);

      this.maxMove = {
      left: options.maxMoveLeft,
      right: options.maxMoveRight,
    };

    this.onShipHit = options.onShipHit || function(){};

    this.MOVE_FACTOR = 0.2;
    this.SHOOT_TIME = 200;

    this.brickSize = 2;
    this.shootImage = null;
    this.shoots = [];
    this.lastShoot = 0;

    this.imgs = [];

    var map = ImageMapper.Ship();

    this.size = {
      width: this.brickSize * map[0].length,
      height: this.brickSize * map.length
    };

    this.build();

    this.shield = options.shield;
    this.invasion = {};
  },
  build: function(){
    this.buildShootImage();

    var opts = {
      width: this.size.width,
      height: this.size.height,
      states: [1],
      brickSize: this.brickSize,
      mapper: ImageMapper.Ship(),
      color: this.color
    };

    this.imgs = ImageCreator.getImages(opts);
  },
  update: function(actions, dt){
    var vel = this.MOVE_FACTOR;

    if (actions.indexOf(Controls.Left)>-1){
      if (this.position.x > this.maxMove.left){
        this.position.x -= vel * dt;
      }
    }
    else if (actions.indexOf(Controls.Right)>-1) {
      if (this.position.x < (this.maxMove.right - this.size.width)){
        this.position.x += vel * dt;
      }
    }

    this.lastShoot -= dt;
    var shootIdx = actions.indexOf(Controls.Shoot);
    if (shootIdx>-1 && this.lastShoot <= 0){
      this.lastShoot = this.SHOOT_TIME;
      actions.splice(shootIdx, 1);
      this.makeShoot();
    }

    var s = this.shoots;
    var sLen = s.length;
    for(var i=0; i< sLen; i++){
      if (s[i]){
        s[i].update(dt);
      }
    }
  },
  draw: function(){
    this._super(this.imgs[0]);

    var s = this.shoots;
    var sLen = s.length;
    for(var i=0; i< sLen; i++){
      if (s[i]){
        s[i].draw();
      }
    }
  },
  collided: function(){
    this.onShipHit();
  },
  destroy: function(){
    this.onShipHit = null;

    this.shootImage = null;

    for(var i=0; i< this.shoots.length; i++){
      this.shoots[i].destroy();
    }
    this.shoots = [];

    this.imgs = [];

    this.shield = null;
    this.invasion = null;

    this._super();
  },
  makeShoot: function(){
    var self = this;

    var s = new Shoot({
      ctx: this.ctx,
      x: this.position.x + (this.size.width /2),
      y: this.position.y,
      dir: -1,
      shootImage: this.shootImage,
      onDestroy: function(s){
        for(var i=0; i<self.shoots.length; i++){
          if (self.shoots[i] === s){
            self.shoots.splice(i, 1);
            break;
          }
        }
      },
      collateBricks: this.shield.bricks,
      collateAliens: this.invasion.aliens
    });

    this.shoots.push(s);
  },
  buildShootImage: function(){
    var map = ImageMapper.ShipShoot(),
      brickSize = 2,
      width = brickSize * map[0].length,
      height = brickSize * map.length;

    var opts = {
      width: width,
      height: height,
      states: [1],
      brickSize: brickSize,
      mapper: map,
      color: this.color
    };

    this.shootImage = ImageCreator.getImages(opts)[0];
  }
});

var Invasion = DrawableElement.extend({
  init: function(options){
    this._super(options);

    this.colors = {
      crab: '#FF2727',
      squid: '#F8FF41'
    };

    this.size = {
      width: 390,
      height: 210
    };

    this.shield = options.shield;
    this.ship = options.ship;

    this.MOVE_FACTOR = 10;
    this.DOWN_FACTOR = 12;
    this.CURR_VEL = 600;
    this.VEL_FACTOR = 50;

    this.MOVE_TIME = 500;
    this.lastMove = 0;

    this.dir = 1;
    this.lastDir = 1;
    this.lastPer = 100;

    this.state = 0;

    this.alienSize = 30;
    this.aliens = [];

    this.crabImages = [];
    this.squidImages = [];
    this.deadAlienImgs = [];

    this.shootImage = null;
    this.shoots = [];

    this.build();

    this.aliensAmm = this.aliens.length;
    this.hadAlienCollision = false;

    this.onAliensClean = options.onAliensClean || function(){};

    this.timer = null;
    //this.update();
  },
  build: function(){
    var self = this;
    this.buildShootImage();
    this.buildAliensImages();

    var aSize = this.alienSize;
    var x = this.position.x;
    var y = this.position.y;
    var ctx = this.ctx;

    var aliensArr = ImageMapper.Invasion();
    var aArrLen = aliensArr.length;

    for(var i=0; i< aArrLen; i++){
      var aColLen = aliensArr[i].length;

      for(var j=0; j< aColLen; j++){

        if (aliensArr[i][j]){
          var alien;
          var opts = {
            ctx: ctx,
            x: (j * aSize) + x,
            y: (i * aSize) + y,
            width: aSize,
            height: aSize,
            destroyedImg: this.deadAlienImgs,
            shield: this.shield,
            ship: this.ship,
            onDestroy: function(alien){
              for(var i=0; i<self.aliens.length; i++){
                if (self.aliens[i] === alien){
                  self.aliens.splice(i, 1);
                  break;
                }
              }
            },
            onWallCollision: function(){
              self.hadAlienCollision = true;
            }
          };

          switch(aliensArr[i][j]){
            case 1:
              opts.stateImgs = this.crabImages;
              opts.color = this.colors.crab;
              break;
            case 2:
              opts.stateImgs = this.squidImages;
              opts.color = this.colors.squid;
              break;
          }

          alien = new Alien(opts);
          this.aliens.push(alien);
        }
      }
    }
  },
  loop: function(){
    this.state = !this.state;

    var vel = this.MOVE_FACTOR;
    var hMove = 0;
    var vMove = 0;

    var arr = this.aliens;
    var arrLen = arr.length;

    if (arrLen === 0){
      this.onAliensClean();
    }

    if (this.hadAlienCollision){
      this.dir *= -1;
      this.hadAlienCollision = false;

      vMove = this.DOWN_FACTOR;
      this.lastDir = this.dir;
    }

    hMove = (vel * this.dir);

    this.position.x += hMove;
    this.position.y += vMove;

    var shoot = false;
    if (this.state && Math.floor(Math.random()*2)) {
      shoot = true;

      shooterIdx = [];
      for (var i=0; i<2; i++){
        shooterIdx.push(Math.floor(Math.random()*arrLen));
      }
    }

    for(var i=0; i< arrLen; i++){
      arr[i].position.x += hMove;
      arr[i].position.y += vMove;

      if (shoot && shooterIdx.indexOf(i) > -1)
        this.makeShoot(arr[i]);
    }

    if (this.vMove > 0) this.vMove = 0;

    var cPer = (arrLen * 100) / this.aliensAmm;
    if((this.lastPer - cPer) > 9){
      this.CURR_VEL -= this.VEL_FACTOR;
      this.MOVE_TIME -= this.VEL_FACTOR;
      if (this.MOVE_TIME < 200){
        this.MOVE_TIME = 200;
      }
      this.lastPer = cPer;
      return;
    }
  },
  update: function(dt){
    this.lastMove -= dt;

    if (this.lastMove <= 0){
      this.loop();
      this.lastMove = this.MOVE_TIME;

      var state = this.state;

      var arr = this.aliens;
      var arrLen = arr.length;
      for(var i=0; i< arrLen; i++){
        if (arr[i] !== undefined)
          arr[i].update(dt);
      }
    }

    var shoots = this.shoots;
    var shootsLen = shoots.length;
    for(var i=0; i< shootsLen; i++){
      if (shoots[i]){
        shoots[i].update(dt);
      }
    }
  },
  draw: function(){
    var state = this.state;

    var arr = this.aliens;
    var arrLen = arr.length;
    for(var i=0; i< arrLen; i++){
      if (arr[i] !== undefined)
        arr[i].draw(state);
    }

    var shoots = this.shoots;
    var shootsLen = shoots.length;
    for(var i=0; i< shootsLen; i++){
      shoots[i].draw();
    }
  },
  destroy: function(){
    clearInterval(this.timer);

    this.shield = null;
    this.ship = null;

    for(var i=0; i< this.shoots.length; i++){
      this.shoots[i].destroy();
    }
    this.shoots = [];

    this._super();
  },
  makeShoot: function(alien){
    var shield = this.shield;
    var ship = this.ship;

    var self = this;

    var s = new Shoot({
      ctx: this.ctx,
      x: alien.position.x + (alien.size.width /2),
      y: alien.position.y,
      dir: 1,
      shootImage: this.shootImage,
      onDestroy: function(s){
        for(var i=0; i<self.shoots.length; i++){
          if (self.shoots[i] === s){
            self.shoots.splice(i, 1);
            break;
          }
        }
      },
      collateBricks: shield.bricks,
      collateAliens: [ship]
    });

    this.shoots.push(s);
    //s.update();
  },
  buildShootImage: function(){
    var map = ImageMapper.AlienShoot(),
      brickSize = 2,
      width = brickSize * map[0].length,
      height = brickSize * map.length;

    var opts = {
      width: width,
      height: height,
      states: [1],
      brickSize: brickSize,
      mapper: map,
      color: 'yellow'
    };

    this.shootImage = ImageCreator.getImages(opts)[0];
  },
  buildAliensImages: function(){
    var opts = {
      width: 30,
      height: 30,
      states: [1],
      brickSize: 2
    };

    opts.mapper = ImageMapper.DeadAlien();
    opts.color = 'white';
    this.deadAlienImgs = ImageCreator.getImages(opts);

    opts.states = [2,3];

    opts.mapper = ImageMapper.AlienCrab();
    opts.color = this.colors.crab;
    this.crabImages = ImageCreator.getImages(opts);

    opts.mapper = ImageMapper.AlienSquid();
    opts.color = this.colors.squid;
    this.squidImages = ImageCreator.getImages(opts);
  }
});

var Alien = DrawableElement.extend({
  init: function(options){
    this._super(options);

    this.images = options.stateImgs || [];
    this.destroyedImg = options.destroyedImg || [];

    this.onWallCollision = options.onWallCollision || [];

    this.shield = options.shield || null;
    this.ship = options.ship || null;

    this.destroyed = false;
    this.shoots = [];
  },
  build: function(){

  },
  update: function(){
    this.hasCollision();

    var sX = this.position.x;
    if (sX < 20 || sX > (590 - this.size.width))
      this.onWallCollision();

    var sY = this.position.y + this.size.height;
    if (sY < 0) this.ship.collided();
  },
  draw: function(state){
    if (!this.destroyed){
      var idx = (state) ? 0: 1;
      this._super(this.images[idx]);
    }
    else {
      this._super(this.destroyedImg[0]);
      this.destroy();
      this.onDestroy(this);
    }
  },
  hasCollision: function(){
    var sX = this.position.x + this.size.width/2;
    var sY = this.position.y + this.size.height*0.8;

    function checkCollision(arr){
      if (!arr){
        return false;
      }

      var cb = arr;
      var cbLen = cb.length;

      for(var i=0; i< cbLen; i++){
        var cbO = cb[i];

        var cbL = cbO.position.x;
        var cbT = cbO.position.y;
        var cbR = cbL + cbO.size.width;
        var cbD = cbT + cbO.size.height;

        if (sX >= cbL && sX <= cbR && sY >= cbT && sY <= cbD && !cbO.destroyed){
          arr[i].collided(true);
          return true;
        }
      }

      return false;
    }

    if (checkCollision(this.shield.bricks)) return true;
    if (checkCollision([this.ship])) return true;
  },
  collided: function(){
    this.destroyed = true;

    window.camera.shake(3);

    window.particles.create([
      this.position.x + this.size.width/2,
      this.position.y + this.size.height/2
    ], 10, this.color);

  },
  destroy: function(){
    this._super();
  }
});


var Brick = DrawableElement.extend({
  init: function(options){
    this._super(options);

    this.destroyed = false;
    this.value = options.value || 1;
  },
  build: function(){

  },
  update: function(dt){

  },
  draw: function(){
    if (!this.destroyed){
      this.ctx.beginPath();
      this.ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);

      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
  },
  destroy: function(){
    this.destroyed = true;
  }
});


var ShieldBrick = DrawableElement.extend({
  init: function(options){
    this._super(options);

    this.state = 0;
    this.imgsState = options.imgsState;
    this.destroyed = false;
  },
  build: function(){

  },
  update: function(){

  },
  draw: function(){
    if (!this.destroyed){
      this._super(this.imgsState[this.state]);
     }
  },
  collided: function(full){
    window.camera.shake(1);
    window.particles.create([
      this.position.x + this.size.width/2,
      this.position.y + this.size.height/2
    ], 4, this.color);

    if (full) this.state = Math.floor((Math.random()*3)+2);
    else this.state++;

    if (this.state > 1){
      this.destroyed = true;
    }
  },
  destroy: function(){
    this._super();
  }
});


var Shield = DrawableElement.extend({
  init: function(options){
    this._super(options);

    this.imgs = [];
    this.build();
  },
  build: function(){
    this.createImagesStateBricks();

    var bSize = this.brickSize;
    var x = this.position.x;
    var y = this.position.y;
    var ctx = this.ctx;
    var color = this.color;

    var fernetArr = ImageMapper.Shield();
    var fArrLen = fernetArr.length;

    for(var i=0; i< fArrLen; i++){
      var fColLen = fernetArr[i].length;

      for(var j=0; j< fColLen; j++){

        if (fernetArr[i][j]){
          var b = new ShieldBrick({
            ctx: ctx,
            x: (j * bSize) + x,
            y: (i * bSize) + y,
            width: bSize,
            height: bSize,
            color: color,
            imgsState: this.imgs
          });

          this.bricks.push(b);
        }
      }
    }
  },
  update: function(dt){
    var b = this.bricks;
    var bLen = b.length;

    for(var i=0; i< bLen; i++){
      if (b[i]){
        b[i].update(dt);
      }
    }
  },
  draw: function(){
    var b = this.bricks;
    if (!b) return;

    var bLen = b.length;

    for(var i=0; i< bLen; i++){
      if (b[i]){
        b[i].draw();
      }
    }
  },
  destroy: function(){
    var b = this.bricks;
    var bLen = b.length;
    for(var i=0; i< bLen; i++){
      b[i].destroy();
    }
    this.bricks = [];

    this._super();
  },
  createImagesStateBricks: function(){
    var opts = {
      width: this.brickSize,
      height: this.brickSize,
      states: [1],
      brickSize: 2,
      color: this.color
    };

    var states = ImageMapper.ShieldBrick();

    for (var i=0; i< states.length; i++){
      opts.mapper = states[i];
      this.imgs.push(ImageCreator.getImages(opts)[0]);
    }
  }
});

var Invaders404 = Class.extend({
  init : function(options) {
    this.canvas = null;
    this.ctx = null;

    this.loopInterval = 10;
    this.currentDir = [];

    this.shield = {};
    this.ship = {};
    this.invasion = {};

    this.initCanvas(options.canvasId);

    this.onLoose = options.onLoose || function(){};
    this.onWin = options.onWin || function(){};

    this.isOnGame = false;

    this.boundGameRun = this.gameRun.bind(this);

    /* FPS Info */
    this.fps = 0
    this.now = null;
    this.lastUpdate = (new Date) * 1 - 1;
    this.fpsFilter = this.loopInterval;

    var self = this;
    var fpsOut = document.getElementById('fps');
    setInterval(function() {
      fpsOut.innerHTML = self.fps.toFixed(1) + "fps";
    }, 1000);
    /* End FPS Info */
  },
  initCanvas : function(canvasId) {
    this.canvas = document.getElementById(canvasId || 'canvas');
    this.ctx = this.canvas.getContext('2d');
    window.particles.init(this.ctx, { w: this.canvas.width, h: this.canvas.height });
  },
  start : function() {
    this.build();
    this.gameRun();
  },
  gameRun: function(){
    if (window.gameTime.tick()) { this.loop(); }
    this.tLoop = window.requestAnimationFrame(this.boundGameRun);
  },
  build : function() {
    var self = this;

    this.shield = new Shield({
      ctx : this.ctx,
      x : 70,
      y : 290,
      brickSize : 12,
      color : '#ffffff'
    });

    var cnvW = this.canvas.width;

    this.ship = new Ship({
      ctx : this.ctx,
      shield : this.shield,
      maxMoveLeft : 5,
      maxMoveRight : cnvW - 10,
      x : ((cnvW - 10) / 2),
      y : 370,
      color : '#1be400',
      onShipHit : function() {
        self.stop();
        self.onLoose();
      }
    });

    this.invasion = new Invasion({
      ctx : this.ctx,
      x : 60,
      y : 10,
      shield : this.shield,
      ship : this.ship,
      onAliensClean : function() {
        self.stop();
        self.onWin();
      }
    });

    this.ship.invasion = this.invasion;

    this.currentDir = [];

    this.isOnGame = true;
    this.bindControls();
  },
  loop : function() {
    if (this.isOnGame){
      this.update(window.gameTime.frameTime);
      this.draw();
    }
  },
  update : function(dt) {
    window.camera.update(dt);
    this.shield.update(dt);
    this.ship.update(this.currentDir, dt);
    this.invasion.update(dt);
    window.particles.update(dt);
  },
  draw : function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.shield.draw();
    this.ship.draw();
    this.invasion.draw();
    window.particles.draw();

    /* FPS Info */
    var thisFrameFPS = 1000 / ((this.now = new Date) - this.lastUpdate);
    this.fps += (thisFrameFPS - this.fps) / this.fpsFilter;
    this.lastUpdate = this.now;
    /* End FPS Info */
  },
  bindControls : function(params) {
    var self = this;
    var gameKeys = [Keyboard.Space, Keyboard.Left, Keyboard.Right];

    function getAction(code) {
      switch (code) {
        case Keyboard.Space:
          return Controls.Shoot;
        case Keyboard.Left:
          return Controls.Left;
        case Keyboard.Right:
          return Controls.Right;
      }

      return null;
    }

    document.addEventListener('keydown', function(event) {
      if(self.isOnGame) {
        var key = event.keyCode;

        if(gameKeys.indexOf(key) > -1) {
          var dir = getAction(key);

          if(self.currentDir.indexOf(dir) === -1)
            self.currentDir.push(dir);

          event.stopPropagation();
          event.preventDefault();
          return false;
        }
      }
    });

    document.addEventListener('keyup', function(event) {
      if(self.isOnGame) {
        var key = event.keyCode;

        var dir = getAction(key);
        var pos = self.currentDir.indexOf(dir);
        if(pos > -1)
          self.currentDir.splice(pos, 1);
      }
    });
  },
  unbindControls : function(params) {
    document.removeEventListener('keydown', function() {});
    document.removeEventListener('keyup', function() {});
  },
  destroy : function() {
    this.shield.destroy();
    this.invasion.destroy();
    this.ship.destroy();
  },
  stop : function() {
    //this.unbindControls();
    this.isOnGame = false;

    for(var i = 0; i < this.currentDir.length; i++)
    this.currentDir[i] = null;

    this.currentDir = [];

    this.destroy();
  },
  drawSplash : function(callback) {
    var ctx = this.ctx,
      cols = this.canvas.height,
      colsL = this.canvas.width,
      colIdx = 0;

    function drawColumn(idx, color){
      var size = 20;
      var x = (idx*size)-size;

      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(x, 0, size, cols);
      ctx.restore();
    }

    var loopInterval = this.loopInterval*2;

    function doForward(){
      for(var i=0; i<5; i++){
        drawColumn(colIdx+i, "rgba(240,219,79," + (i ? i/10 : 1) + ")");
      }

      colIdx++;

      if(colIdx < colsL/10)
        setTimeout(doForward, loopInterval);
      else {
        callback();
        //colIdx = colsL/10;
        //doBack();
      }
    }

    function doBack(){
      for(var i=5; i>=0; i--){
        drawColumn(colIdx-i, "rgba(0,0,0," + (i ? i/10 : 1) + ")");
      }

      colIdx--;

      if(colIdx > 0)
        setTimeout(doBack, loopInterval);
      else {
        callback();
      }
    }

    doForward();
  }
});
/*
Input.js is MIT-licensed software
Copyright (c) 2011 Jon Buckley
*/

(function() {
  // Holds all of the physical device to USB enumeration mappings
  var keymapBlob = {
    '45e' : { /* Microsoft */
      '28e' : { /* Xbox 360 controller */
        'Mac' : {
          'axes' : {
            'Left_Stick_X': 0,
            'Left_Stick_Y': 1,
            'Right_Stick_X': 2,
            'Right_Stick_Y': 3,
            'Left_Trigger_2': [4, -1, 1],
            'Right_Trigger_2': [5, -1, 1]
          },
          'buttons' : {
            'A_Button': 0,
            'B_Button': 1,
            'X_Button': 2,
            'Y_Button': 3,
            'Left_Trigger_1': 4,
            'Right_Trigger_1': 5,
            'Left_Stick_Button': 6,
            'Right_Stick_Button': 7,
            'Start_Button': 8,
            'Back_Button': 9,
            'Home_Button': 10,
            'Pad_Up': 11,
            'Pad_Down': 12,
            'Pad_Left': 13,
            'Pad_Right': 14
          }
        },
        "Win": {
          "axes": {
            "Left_Stick_X": 0,
            "Left_Stick_Y": 1,
            "Right_Stick_X": 3,
            "Right_Stick_Y": 4,
            "Pad_Left": [5, 0, -1],
            "Pad_Right": [5, 0, 1],
            "Pad_Up": [6, 0, -1],
            "Pad_Down": [6, 0, 1],
            "Left_Trigger_2": [2, 0, 1],
            "Right_Trigger_2": [2, 0, -1]
          },
          "buttons": {
            "A_Button": 0,
            "B_Button": 1,
            "X_Button": 2,
            "Y_Button": 3,
            "Left_Trigger_1": 4,
            "Right_Trigger_1": 5,
            "Back_Button": 6,
            "Start_Button": 7,
            "Left_Stick_Button": 8,
            "Right_Stick_Button": 9
          }
        }
      }
    },
    "54c": { /* Sony */
      "268": { /* PS3 Controller */
        "Mac": {
          "axes": {
            "Left_Stick_X": 0,
            "Left_Stick_Y": 1,
            "Right_Stick_X": 2,
            "Right_Stick_Y": 3
          },
          "buttons": {
            "Back_Button": 0,
            "Left_Stick_Button": 1,
            "Right_Stick_Button": 2,
            "Start_Button": 3,
            "Pad_Up": 4,
            "Pad_Down": 6,
            "Pad_Right": 5,
            "Pad_Left": 7,
            "Left_Trigger_2": 8,
            "Right_Trigger_2": 9,
            "Left_Trigger_1": 10,
            "Right_Trigger_1": 11,
            "Y_Button": 12,
            "B_Button": 13,
            "A_Button": 14,
            "X_Button": 15,
            "Home_Button": 16
          }
        }
      }
    },
    "46d": { /* Logitech */
      "c242": { /* Chillstream */
        "Win": {
          "axes": {
            "Left_Stick_X": 0,
            "Left_Stick_Y": 1,
            "Right_Stick_Y": 4,
            "Right_Stick_X": 3,
            "Left_Trigger_2": [2, 0, 1],
            "Right_Trigger_2": [2, -1, 0],
            "Pad_Left": [5, -1, 0],
            "Pad_Right": [5, 0, 1],
            "Pad_Up": [6, -1, 0],
            "Pad_Down": [6, 0, 1]
          },
          "buttons": {
            "A_Button": 0,
            "X_Button": 2,
            "B_Button": 1,
            "Y_Button": 3,
            "Left_Trigger_1": 4,
            "Right_Trigger_1": 5,
            "Back_Button": 6,
            "Start_Button": 7,
            "Left_Stick_Button": 8,
            "Right_Stick_Button": 9
          }
        }
      },
      "c216": { /* Dual Action */
        "Mac": {
          "axes": {
            "Left_Stick_X": 1,
            "Left_Stick_Y": 2,
            "Right_Stick_X": 3,
            "Right_Stick_Y": 4,
            "Pad_Left": [1, 0, -1],
            "Pad_Right": [1, 0, 1],
            "Pad_Up": [2, 0, -1],
            "Pad_Down": [2, 0, 1]
          },
          "buttons": {
            "X_Button": 0,
            "A_Button": 1,
            "B_Button": 2,
            "Y_Button": 3,
            "Left_Trigger_1": 4,
            "Right_Trigger_1": 5,
            "Left_Trigger_2": 6,
            "Right_Trigger_2": 7,
            "Back_Button": 8,
            "Start_Button": 9,
            "Left_Stick_Button": 10,
            "Right_Stick_Button": 11
          }
        }
      }
    },
    "40b": {
      "6533": { /* USB 2A4K GamePad */
        "Mac": {
          "axes": {
            "Pad_Left": [0, 0, -1],
            "Pad_Right": [0, 0, 1],
            "Pad_Up": [1, 0, -1],
            "Pad_Down": [1, 0, 1]
          },
          "buttons": {
            "A_Button": 0,
            "B_Button": 1,
            "X_Button": 2,
            "Y_Button": 3
          }
        }
      }
    },
    "Firefox": {
      "Fake Gamepad": {
        "Mac": {
          "axes": {

          },
          "buttons": {
            'A_Button' : 0,
            'B_Button' : 1,
            'X_Button' : 2,
            'Y_Button' : 3,
            'Pad_Up' : 4,
            'Pad_Down': 5,
            'Pad_Left': 6,
            'Pad_Right': 7
          }
        }
      }
    }
  };

  // Our ideal gamepad that we present to the developer
  var ImaginaryGamepad = {
    'axes' : [
      'Left_Stick_X',
      'Left_Stick_Y',
      'Right_Stick_X',
      'Right_Stick_Y'
    ],
    'buttons' : [
      'A_Button',
      'B_Button',
      'X_Button',
      'Y_Button',
      'Left_Stick_Button',
      'Right_Stick_Button',
      'Start_Button',
      'Back_Button',
      'Home_Button',
      'Pad_Up',
      'Pad_Down',
      'Pad_Left',
      'Pad_Right',
      'Left_Trigger_1',
      'Right_Trigger_1',
      'Left_Trigger_2',
      'Right_Trigger_2'
    ]
  };

  var osList = ['Win', 'Mac', 'Linux'];
  function detectOS() {
    for (var i in osList) {
      if (navigator.platform.indexOf(osList[i]) !== -1) {
        return osList[i];
      }
    }
    return 'Unknown';
  }

  function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  };

  // Map imaginary device action to physical device action
  function mapAxisToAxis(device, keymap, axes, prop) {
    Object.defineProperty(axes, prop, {
      enumerable: true,
      get: function() { return device.axes[keymap.axes[prop]]; }
    });
  }

  function mapAxisToButton(device, keymap, axes, prop) {
    Object.defineProperty(axes, prop, {
      enumerable: true,
      get: function() { return 0; }
    });
  }

  function mapButtonToButton(device, keymap, buttons, prop) {
    Object.defineProperty(buttons, prop, {
      enumerable: true,
      get: function() { return device.buttons[keymap.buttons[prop]]; }
    });
  }

  function mapButtonToAxis(device, keymap, buttons, prop) {
    var transform = keymap.axes[prop] instanceof Array;

    Object.defineProperty(buttons, prop, {
      enumerable: true,
      get: function() {
        if (transform) {
          return map(device.axes[keymap.axes[prop][0]], keymap.axes[prop][1], keymap.axes[prop][2], 0, 1);
        } else {
          return device.axes[keymap.axes[prop]];
        }
      }
    });
  }

  function mapZero(type, prop) {
    Object.defineProperty(type, prop, {
      enumerable: true,
      get: function() { return 0; }
    });
  }

  var Input = window.Input = {};
  var Device = Input.Device = function(domGamepad) {
    if (!domGamepad) {
      throw "You didn't pass a valid gamepad to the constructor";
    }

    var device = domGamepad,
        usbVendor = domGamepad.id.split('-')[0],
        usbDevice = domGamepad.id.split('-')[1],
        os = detectOS(),
        keymap = keymapBlob,
        axes = this.axes = {},
        buttons = this.buttons = {};

    if (keymap && keymap[usbVendor] && keymap[usbVendor][usbDevice] && keymap[usbVendor][usbDevice][os]) {
      keymap = keymap[usbVendor][usbDevice][os];
    } else {
      throw "A physical device layout for " + usbVendor + "-" + usbDevice + "-" + os + " isn't available";
    }

    // Wire the axes and buttons up
    for (var a in ImaginaryGamepad.axes) {
      if (keymap.axes[ImaginaryGamepad.axes[a]] !== undefined) {
        mapAxisToAxis(device, keymap, axes, ImaginaryGamepad.axes[a]);
      } else if (keymap.buttons[ImaginaryGamepad.axes[a]] !== undefined) {
        mapAxisToButton(device, keymap, axes, ImaginaryGamepad.axes[a]);
      } else {
        mapZero(axes, ImaginaryGamepad.axes[a]);
      }
    }

    for (var b in ImaginaryGamepad.buttons) {
      if (keymap.buttons[ImaginaryGamepad.buttons[b]] !== undefined) {
        mapButtonToButton(device, keymap, buttons, ImaginaryGamepad.buttons[b]);
      } else if (keymap.axes[ImaginaryGamepad.buttons[b]] !== undefined) {
        mapButtonToAxis(device, keymap, buttons, ImaginaryGamepad.buttons[b]);
      } else {
        mapZero(buttons, ImaginaryGamepad.buttons[b]);
      }
    }

    // Add some useful properties from the DOMGamepad object
    Object.defineProperty(this, "connected", {
      enumerable: true,
      get: function() { return device.connected; }
    });

    Object.defineProperty(this, "id", {
      enumerable: true,
      get: function() { return device.id; }
    });

    Object.defineProperty(this, "index", {
      enumerable: true,
      get: function() { return device.index; }
    });
  };
}());
