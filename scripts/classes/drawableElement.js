/**
 * @author pjnovas
 */

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
			this.ctx.drawImage(img, this.position.x, this.position.y);
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
