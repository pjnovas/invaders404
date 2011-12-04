/**
 * @author pjnovas
 */

var Invasion = DrawableElement.extend({
	init: function(options){
		this._super(options);
		
		this.size = {
			width: 390,
			height: 210
		};
		
		this.shield = options.shield;
		this.ship = options.ship;
		
		this.MOVE_FACTOR = 10;
		this.DOWN_FACTOR = 5;
		this.CURR_VEL = 600;
		this.VEL_FACTOR = 50;
		
		this.dir = 1;
		this.lastDir = 1;
		this.lastPer = 100;
		
		this.state = 0;
		
		this.alienSize = 30;
		this.aliens = [];
			
		this.crabImages = [];
		this.squidImages = [];
		this.deadAlienImgs = [];
	
		this.shootImage = null;
		this.shoots = [];
	
		this.build();
		
		this.aliensAmm = this.aliens.length; 
		this.hadAlienCollision = false;
		
		this.update();
	},
	build: function(){
		var self = this;
		this.buildShootImage();
		this.buildAliensImages();
		
		var aSize = this.alienSize;
		var x = this.position.x;
		var y = this.position.y;
		var ctx = this.ctx;
		
		var aliensArr = this.getInvasionMap();
		var aArrLen = aliensArr.length;
		
		for(var i=0; i< aArrLen; i++){
			var aColLen = aliensArr[i].length;
			
			for(var j=0; j< aColLen; j++){
				
				if (aliensArr[i][j]){
					var alien;
					var opts = {
						ctx: ctx,
						x: (j * aSize) + x,
						y: (i * aSize) + y,
						width: aSize,
						height: aSize,
						destroyedImg: this.deadAlienImgs,
						onDestroy: function(alien){
							for(var i=0; i<self.aliens.length; i++){
								if (self.aliens[i] === alien){
									self.aliens.splice(i, 1);
									break;
								}
							}
						},
						onWallCollision: function(){
							self.hadAlienCollision = true;
						}
					};
					
					switch(aliensArr[i][j]){
						case 1:
							opts.stateImgs = this.crabImages;
							break;
						case 2:
							opts.stateImgs = this.squidImages;
							break;
					}
					
					alien = new Alien(opts);
					this.aliens.push(alien);
				}
			}
		}
	},
	update: function(){
		this.state = !this.state;
	
		var vel = this.MOVE_FACTOR;
		var hMove = 0;
		var vMove = 0;
	
		var arr = this.aliens;
		var arrLen = arr.length;
		
		if (this.hadAlienCollision){
			this.dir *= -1;
			this.hadAlienCollision = false;
			
			vMove = this.DOWN_FACTOR;
			this.lastDir = this.dir;
		}

		var cPer = (arrLen * 100) / this.aliensAmm;
		if((this.lastPer - cPer) > 9){
			this.CURR_VEL -= this.VEL_FACTOR;
			this.lastPer = cPer;
		}
				
		hMove = (vel * this.dir);
		
		this.position.x += hMove;
		this.position.y += vMove;
		
		var shooterIdx = Math.floor(Math.random()*arrLen);
		
		var shoot = false;
		if (this.state && Math.floor(Math.random()*2))
			shoot = true;
		
		for(var i=0; i< arrLen; i++){
			arr[i].position.x += hMove;
			arr[i].position.y += vMove;
			
			if (shoot && shooterIdx === i)
				this.makeShoot(arr[i]);
			
			arr[i].update();
		}
		
		if (this.vMove > 0)
			this.vMove = 0;
		
		var self = this;
		setTimeout(function(){ self.update(); }, this.CURR_VEL);
	},
	draw: function(){
		var state = this.state;
		
		var arr = this.aliens;
		var arrLen = arr.length;
		for(var i=0; i< arrLen; i++){
			if (arr[i] !== undefined)
				arr[i].draw(state);
		}
		
		var shoots = this.shoots;
		var shootsLen = shoots.length;
		for(var i=0; i< shootsLen; i++){
			shoots[i].draw();
		}
	},
	destroy: function(){
		
	},
	makeShoot: function(alien){
		var shield = this.shield;
		var ship = this.ship;
		
		var self = this;
		
		var s = new Shoot({
			ctx: this.ctx,
			x: alien.position.x + (alien.size.width /2),
			y: alien.position.y,
			dir: 1,
			shootImage: this.shootImage,
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
	},
	buildShootImage: function(){
		var map = this.getAlienShootMap(),
			brickSize = 2,
			width = brickSize * map[0].length,
			height = brickSize * map.length;
		
		var opts = {
			width: width,
			height: height,
			states: [1],
			brickSize: brickSize,
			mapper: map,
			color: '#fff'
		};
		
		this.shootImage = ImageCreator.getImages(opts)[0];
	},
	buildAliensImages: function(){
		var opts = {
			width: 30,
			height: 30,
			states: [1],
			brickSize: 2		
		};
		
		opts.mapper = this.getDeadAlienMap();
		opts.color = 'white';
		this.deadAlienImgs = ImageCreator.getImages(opts);
		
		opts.states = [2,3];
		
		opts.mapper = this.getCrabMap();
		opts.color = '#ff2727'; //red
		this.crabImages = ImageCreator.getImages(opts);
		
		opts.mapper = this.getSquidMap();
		opts.color = '#f8ff41'; //yellow
		this.squidImages = ImageCreator.getImages(opts);
	},
	getInvasionMap: function(){	
		return [
			[2,2,2,2,2,2,2,2,2,2,2,2,2],
			[2,2,2,1,2,1,1,1,2,2,2,1,2],
			[2,2,1,1,2,1,2,1,2,2,1,1,2],
			[2,1,2,1,2,1,2,1,2,1,2,1,2],
			[2,1,1,1,2,1,2,1,2,1,1,1,2],
			[2,2,2,1,2,1,1,1,2,2,2,1,2],
			[2,2,2,2,2,2,2,2,2,2,2,2,2]
		];
	},
	getCrabMap: function(){	
		return [
			[0,0,1,0,0,0,0,0,1,0,0],
			[3,0,0,1,0,0,0,1,0,0,3],
			[3,0,0,1,0,0,0,1,0,0,3],
			[3,0,1,1,1,1,1,1,1,0,3],
			[3,0,1,0,1,1,1,0,1,0,3],
			[3,1,1,1,1,1,1,1,1,1,3],
			[2,1,1,1,1,1,1,1,1,1,2],
			[2,0,1,1,1,1,1,1,1,0,2],
			[2,0,1,1,1,1,1,1,1,0,2],
			[2,0,1,0,0,0,0,0,1,0,2],
			[2,0,1,0,0,0,0,0,1,0,2],
			[0,3,0,2,2,0,2,2,0,3,0]
		];
	},
	getSquidMap: function(){	
		return [
			[0,0,0,0,0,1,0,0,0,0,0],
			[0,0,0,0,1,1,1,0,0,0,0],
			[0,0,0,1,1,1,1,1,0,0,0],
			[0,0,1,1,1,1,1,1,1,0,0],
			[0,1,1,0,1,1,1,0,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1],
			[0,0,1,0,0,0,0,0,1,0,0],
			[0,0,1,0,0,0,0,0,1,0,0],
			[0,1,0,3,0,0,0,3,0,1,0],
			[3,0,1,0,3,0,3,0,1,0,3]
		];
	},
	getDeadAlienMap: function(){	
		return [
			[1,0,0,0,0,0,0,0,0,0,1],
			[0,1,0,0,0,1,0,0,0,1,0],
			[0,0,1,0,0,1,0,0,1,0,0],
			[0,0,0,1,0,1,0,1,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,0,0,0,1,1,1,1],
			[0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,1,0,1,0,1,0,0,0],
			[0,0,1,0,0,1,0,0,1,0,0],
			[0,1,0,0,0,1,0,0,0,1,0],
			[1,0,0,0,0,1,0,0,0,0,1]
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
