/**
 * @author pjnovas
 */

function Invasion(options){
	this.ctx = options.ctx;
	
	this.size = {
		width: 390,
		height: 210
	};
	
	this.position = {
		x: options.x,
		y: options.y
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

	this.build();
	
	this.aliensAmm = this.aliens.length; 
	this.hadAlienCollision = false;
	
	this.update();
}

Invasion.prototype.update = function(){
	this.state = !this.state;
	
	var vel = this.MOVE_FACTOR;
	var hMove = 0;
	var vMove = 0;

	var arr = this.aliens;
	var arrLen = arr.length;
	
	if (this.hadAlienCollision){
		this.dir *= -1;
		this.hadAlienCollision = false;
		
		var cPer = (this.aliens.length * 100) / this.aliensAmm;
		if((this.lastPer - cPer) > 7){
			this.CURR_VEL -= this.VEL_FACTOR;
			this.lastPer = cPer;
		}
		
		vMove = this.DOWN_FACTOR;
		this.lastDir = this.dir;
	}
	
	hMove = (vel * this.dir);
	
	this.position.x += hMove;
	this.position.y += vMove;
	
	var shooterIdx = Math.floor(Math.random()*arrLen);
	
	for(var i=0; i< arrLen; i++){
		arr[i].position.x += hMove;
		arr[i].position.y += vMove;
		
		var shoot = false;
		if (shooterIdx === i && this.state)
			shoot = true;
		
		arr[i].update(this.state, shoot, this.shield, this.ship);
	}
	
	if (this.vMove > 0)
		this.vMove = 0;
	
	var self = this;
	setTimeout(function(){ self.update(); }, this.CURR_VEL);
}

Invasion.prototype.draw = function(){
	var arr = this.aliens;
	var arrLen = arr.length;
	
	for(var i=0; i< arrLen; i++){
		if (arr[i] !== undefined)
			arr[i].draw();
	}
}

Invasion.prototype.build = function(){
	var self = this;
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
					initState: 0,
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
}

Invasion.prototype.buildAliensImages = function(){
	
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
}

Invasion.prototype.getInvasionMap = function(){	
	return [
		[2,2,2,2,2,2,2,2,2,2,2,2,2],
		[2,2,2,1,2,1,1,1,2,2,2,1,2],
		[2,2,1,1,2,1,2,1,2,2,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,2,1,2,1,2,1,1,1,2],
		[2,2,2,1,2,1,1,1,2,2,2,1,2],
		[2,2,2,2,2,2,2,2,2,2,2,2,2]
	];

}

//TODO: Octopus

Invasion.prototype.getCrabMap = function(){	
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
}

Invasion.prototype.getSquidMap = function(){	
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
}

Invasion.prototype.getDeadAlienMap = function(){	
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
}
