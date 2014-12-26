
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