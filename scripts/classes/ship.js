/**
 * @author pjnovas
 */

function Ship(options){
	this.ctx = options.ctx;
	
	this.position = {
		x: (options.maxMoveRight / 2),
		y: options.y
	};
	
	this.maxMove = {
		left: options.maxMoveLeft,
		right: options.maxMoveRight,
	}
	
	this.color = '#1be400';
	
	this.MOVE_FACTOR = 5;
	
	this.brickSize = 2;
	this.shoots = [];

	this.imgs = [];
	
	var map = this.getShipMap();
	
	this.size = {
		width: this.brickSize * map[0].length,
		height: this.brickSize * map.length 
	};
	
	this.build();
	
	this.shield = options.shield;
	this.invasion = {};
}

Ship.prototype.update = function(actions){
	var vel = this.MOVE_FACTOR;
	
	if ($.inArray(Controls.Left, actions)>-1){
		if (this.position.x > this.maxMove.left){
			this.position.x -= vel;
		}
	}
	else if ($.inArray(Controls.Right, actions)>-1) { 
		if (this.position.x < (this.maxMove.right - this.size.width)){
			this.position.x += vel;
		}
	}
	
	var shootIdx = $.inArray(Controls.Shoot, actions);
	if (shootIdx>-1 && this.shoots.length === 0){
       	actions.splice(shootIdx, 1);
       	
        var self = this;
        
		var s = new Shoot({
			ctx: this.ctx,
			x: this.position.x + (this.size.width /2),
			y: this.position.y,
			dir: -1,
			shootShip: true,
			color: this.color,
			onDestroy: function(s){
				for(var i=0; i<self.shoots.length; i++){
					if (self.shoots[i] === s){
						self.shoots.splice(i, 1);
						break;
					}
				}
			},
			collateBricks: this.shield.bricks,
			collateAliens: this.invasion.aliens 
		});
		
		this.shoots.push(s);
		s.update();
	}
}

Ship.prototype.draw = function(){
	
	this.ctx.drawImage(this.imgs[0], 0, 0, this.size.width, this.size.height,
                this.position.x, this.position.y, this.size.width, this.size.height);
	
	var s = this.shoots;
	var sLen = s.length;
	
	for(var i=0; i< sLen; i++){
		s[i].draw();
	}
}

Ship.prototype.build = function(){
	var opts = {
		width: this.size.width,
		height: this.size.height,
		states: [1],
		brickSize: this.brickSize,
		mapper: this.getShipMap(),
		color: this.color
	};
	
	this.imgs = ImageCreator.getImages(opts);
}

Ship.prototype.getShipMap = function(){	
	return [
		[0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
		[0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
		[0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
		[0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
		[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
		[0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0],
		[0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0],
		[0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0]
	];
}

Ship.prototype.destroy = function(){
	alert('BOOM!');
}
