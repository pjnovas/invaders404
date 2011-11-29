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
	this.destroyedImg = options.destroyedImg;
	this.onDestroy = options.onDestroy;
	this.onWallCollision = options.onWallCollision;
	
	this.destroyed = false;
	this.shoots = [];
}

Alien.prototype.update = function(state, shoot, shield, ship){
	this.state = state;
	
	var sX = this.position.x;
	if (sX < 20 || sX > (590 - this.size.width))
		this.onWallCollision();
	
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
			collateBricks: shield.bricks,
			collateAliens: [ship]
		});
		
		this.shoots.push(s);
		s.update();
	}
}

Alien.prototype.hasCollision = function(){
	
}

Alien.prototype.draw = function(){	
	for(var i=0; i<this.shoots.length; i++){
		this.shoots[i].draw();
	}
	
	if (!this.destroyed){
		var idx = (this.state) ? 0: 1;	
		this.ctx.drawImage(this.images[idx], 0, 0, this.size.width, this.size.height,
	                        this.position.x, this.position.y, this.size.width, this.size.height);
	}
	else {
		this.ctx.drawImage(this.destroyedImg[0], 0, 0, this.size.width, this.size.height,
	                        this.position.x, this.position.y, this.size.width, this.size.height);       
		this.onDestroy(this);
	}
}

Alien.prototype.destroy = function(){
	this.destroyed = true;
}
