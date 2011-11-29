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
	
	this.MOVE_FACTOR = 5;
	this.color = '#1be400';
	
	this.brickSize = 2;
	this.shipBricks = [];
	
	this.shoots = [];
	
	this.build();
	
	var map = this.getShipMap();
	
	this.size = {
		width: this.brickSize * map[0].length,
		height: this.brickSize * map.length 
	};
	
	console.log(this.size.width);
	console.log(this.size.height);
	
	this.shield = options.shield;
	this.invasion = {};
}

Ship.prototype.update = function(actions){
	var vel = this.MOVE_FACTOR;
	
	if ($.inArray(Controls.Left, actions)>-1){
		if (this.position.x > this.maxMove.left){
			var b = this.shipBricks;
			var bLen = b.length;
			
			for(var i=0; i< bLen; i++){
				b[i].position.x -= vel;
				b[i].update();
			}
			this.position.x -= vel;
		}
	}
	else if ($.inArray(Controls.Right, actions)>-1) { 
		if (this.position.x < (this.maxMove.right - this.size.width)){
			var b = this.shipBricks;
			var bLen = b.length;
			
			for(var i=0; i< bLen; i++){
				b[i].position.x += vel;
				b[i].update();
			}
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
			color: '#green',
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
	var b = this.shipBricks;
	var bLen = b.length;
	
	for(var i=0; i< bLen; i++){
		b[i].draw();
	}
	
	var s = this.shoots;
	var sLen = s.length;
	
	for(var i=0; i< sLen; i++){
		s[i].draw();
	}
}

Ship.prototype.build = function(){
	var bSize = this.brickSize;
	var x = this.position.x;
	var y = this.position.y;
	var ctx = this.ctx;
	var color = this.color;
	
	var shipArr = this.getShipMap();
	var sArrLen = shipArr.length;
	
	for(var i=0; i< sArrLen; i++){
		var sColLen = shipArr[i].length;
		
		for(var j=0; j< sColLen; j++){
			
			if (shipArr[i][j]){
				var b = new Brick({
					canvasCtx: ctx,
					x: (j * bSize) + x,
					y: (i * bSize) + y,
					width: bSize,
					height: bSize,
					color: color
				});
				
				this.shipBricks.push(b);
			}
		}
	}
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
