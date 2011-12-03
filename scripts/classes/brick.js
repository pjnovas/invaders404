/**
 * @author pjnovas
 */

function Brick(options){
	this.ctx = options.canvasCtx;
	
	this.position = {
		x: options.x,
		y: options.y
	};
	
	this.size = {
		width: options.width,
		height: options.height
	};
	
	this.color = options.color;
	this.destroyed = false;
	
	var val = 1;
	if (options.value != undefined)
		val = options.value;
	
	this.value = val;
}

Brick.prototype.update = function(val){
	
}

Brick.prototype.draw = function(){
	if (!this.destroyed){
		this.ctx.beginPath();
	    this.ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
	    
	    this.ctx.fillStyle = this.color;
	    this.ctx.fill();
   }
}

Brick.prototype.destroy = function(){
	this.destroyed = true;
}



