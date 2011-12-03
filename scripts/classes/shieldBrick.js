/**
 * @author pjnovas
 */

function ShieldBrick(options){
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
	this.state = 0;
	this.imgsState = options.imgsState;
	
	this.destroyed = false;
}

ShieldBrick.prototype.update = function(){
	
}

ShieldBrick.prototype.draw = function(){
	if (!this.destroyed){
		
		this.ctx.drawImage(this.imgsState[this.state], this.position.x, this.position.y);
   }
}

ShieldBrick.prototype.destroy = function(){
	this.state++;
	
	if (this.state > 2){
		this.destroyed = true;
		//this.onDestroy();
	}	
}



