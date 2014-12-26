
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
