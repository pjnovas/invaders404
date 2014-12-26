
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
