/**
 * @author pjnovas
 */

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
			this.ctx.drawImage(this.imgsState[this.state], 
								this.position.x, this.position.y);
	   }
	},
	destroy: function(){
		this.state++;
		if (this.state > 2){
			this.destroyed = true;
			//this.onDestroy();
		}	
	}
});
