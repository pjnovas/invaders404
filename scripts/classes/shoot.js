
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