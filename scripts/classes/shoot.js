/**
 * @author pjnovas
 */

var Shoot = DrawableElement.extend({
	init: function(options){
		this._super(options);
		
		this.shootShip = options.shootShip;
		
		this.MOVE_FACTOR = 5;
		this.dir = options.dir;
		
		this.brickSize = 2;
		this.shootBricks = [];
		
		this.build();
		
		var map = this.getShootMap();
		this.size = {
			width: this.brickSize * map[0].length,
			height: this.brickSize * map.length 
		};
		
		this.collateBricks = options.collateBricks;
		this.collateAliens = options.collateAliens;
	},
	build: function(){
		var bSize = this.brickSize;
		var x = this.position.x;
		var y = this.position.y;
		var ctx = this.ctx;
		var color = this.color;
		
		var shootArr = null;
		if (this.shootShip)
			shootArr = this.getShootMap();
		else shootArr = this.getAlienShootMap();
		
		var sArrLen = shootArr.length;
		
		for(var i=0; i< sArrLen; i++){
			var sColLen = shootArr[i].length;
			
			for(var j=0; j< sColLen; j++){
				
				if (shootArr[i][j]){
					var b = new Brick({
						ctx: ctx,
						x: (j * bSize) + x,
						y: (i * bSize) + y,
						width: bSize,
						height: bSize,
						color: color
					});
					
					this.shootBricks.push(b);
				}
			}
		}
	},
	update: function(){
		var dir = this.dir;
		var vel = this.MOVE_FACTOR;
		
		var b = this.shootBricks;
		var bLen = b.length;
		
		for(var i=0; i< bLen; i++){
			b[i].position.y += (vel * dir);
			b[i].update();
		}
		
		this.position.y += (vel * dir);
		
		if(this.hasCollision()){
			this.destroy();
			return;
		}
		
		var self = this;
		setTimeout(function(){ self.update(); }, 20);
	},
	draw: function(){
		var b = this.shootBricks;
		var bLen = b.length;
		
		for(var i=0; i< bLen; i++){
			b[i].draw();
		}
	},
	destroy: function(){
		var b = this.shootBricks;
		var i = b.length-1;
		
		do{
			b[i] = null;
		}while(i--);
		
		this.onDestroy(this);
	},
	hasCollision: function(){
		var sX = this.position.x;
		var sY = this.position.y;
		
		if (sY < 0 || sY > 400)
			return true;
			
		function checkCollision(arr){
			var cb = arr;
			var cbLen = cb.length;
			
			for(var i=0; i< cbLen; i++){
				var cbO = cb[i];
				
				var cbL = cbO.position.x;
				var cbT = cbO.position.y;
				var cbR = cbL + cbO.size.width;
				var cbD = cbT + cbO.size.height;
				
				if (sX >= cbL && sX <= cbR && sY >= cbT && sY <= cbD && !cbO.destroyed){
					arr[i].destroy();
					return true;
				}
			}	
			
			return false;
		}
		
		if (checkCollision(this.collateBricks)) return true;
		
		if (this.collateAliens != undefined){
			if (checkCollision(this.collateAliens)) 
				return true;
		}
	},
	getShootMap: function(){	
		return [
			[1],
			[1],
			[1],
			[1],
			[1],
			[1],
			[1]
		];
	},
	getAlienShootMap: function(){	
		return [
			[0,1,0],
			[1,0,0],
			[0,1,0],
			[0,0,1],
			[0,1,0],
			[1,0,0],
			[0,1,0]
		];
	}
});
