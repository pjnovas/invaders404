
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