
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