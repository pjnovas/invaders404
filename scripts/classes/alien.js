/**
 * @author pjnovas
 */

var Alien = DrawableElement.extend({
	init: function(options){
		this._super(options);
		
		this.images = options.stateImgs;
		this.destroyedImg = options.destroyedImg;
		
		this.onWallCollision = options.onWallCollision;
		
		this.destroyed = false;
		this.shoots = [];
	},
	build: function(){
		
	},
	update: function(){
		var sX = this.position.x;
		if (sX < 20 || sX > (590 - this.size.width))
			this.onWallCollision();
	},
	draw: function(state){
		if (!this.destroyed){
			var idx = (state) ? 0: 1;	
			this._super(this.images[idx]);
		}
		else {
			this._super(this.destroyedImg[0]);
			this.onDestroy(this);
		}
	},
	destroy: function(){
		this.destroyed = true;
	}
});
