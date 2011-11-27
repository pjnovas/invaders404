/**
 * @author pjnovas
 */

function Alien(options){
	this.ctx = options.ctx;
	
	this.size = {
		width: options.width,
		height: options.height
	};
	
	this.position = {
		x: options.x,
		y: options.y
	};
		
	this.state = options.initState;
	this.images = options.stateImgs;
	this.onDestroy = options.onDestroy;
	
	this.destroyed = false;
	this.shoots = [];
}

Alien.prototype.update = function(shoot, shield){
	this.state = !this.state;
	
	if (shoot){
		var self = this;
		var s = new Shoot({
			ctx: this.ctx,
			x: this.position.x + (this.size.width /2),
			y: this.position.y,
			dir: 1,
			color: '#fff',
			onDestroy: function(s){
				for(var i=0; i<self.shoots.length; i++){
					if (self.shoots[i] === s){
						self.shoots.splice(i, 1);
						break;
					}
				}
			},
			collateBricks: shield.bricks 
		});
		
		this.shoots.push(s);
		s.update();
	}
}

Alien.prototype.hasCollision = function(){
	
}

Alien.prototype.draw = function(){	
	if (!this.destroyed){
		var idx = (this.state) ? 0: 1;	
		this.ctx.drawImage(this.images[idx], 0, 0, this.size.width, this.size.height,
	                        this.position.x, this.position.y, this.size.width, this.size.height);
	}
	
	for(var i=0; i<this.shoots.length; i++){
		this.shoots[i].draw();
	}
}

Alien.prototype.destroy = function(){
	this.destroyed = true;
	this.onDestroy(this);
}
