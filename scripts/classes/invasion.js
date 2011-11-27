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
	
	this.MOVE_FACTOR = 10;
	this.DOWN_FACTOR = 5;
	this.VEL_FACTOR = 500;
	
	this.dir = 1;
	
	this.alienSize = 30;
	this.aliens = [];
		
	this.crabImages = [];
	this.squidImages = [];
	
	this.build();
	this.update();
	
	//this.onDestroy = options.onDestroy;
	
	//this.collateBricks = options.collateBricks;
}

Invasion.prototype.update = function(){
	
	var vel = this.MOVE_FACTOR;
	var hMove = 0;
	var vMove = 0;

	var sX = this.position.x;
	
	if (sX < 20 || sX > (590 - this.size.width)){
		this.dir *= -1;
		
		//TODO: check aliens ammount
		vMove = this.DOWN_FACTOR;
	}
	
	hMove = (vel * this.dir);
	
	this.position.x += hMove;
	this.position.y += vMove;
	
	/*
	var dir = this.dir;
	var b = this.enemyBricks;
	var bLen = b.length;
	
	for(var i=0; i< bLen; i++){
		b[i].position.x += (vel * dir);
		b[i].position.y += down;
		b[i].update();
	}
	
	this.state = !this.state;
	
	var self = this;
	setTimeout(function(){ self.update(); }, this.VEL_FACTOR);
	*/
	
	
	
	var arr = this.aliens;
	var arrLen = arr.length;
	
	var shooterIdx = Math.floor(Math.random()*arrLen);
	
	for(var i=0; i< arrLen; i++){
		arr[i].position.x += hMove;
		arr[i].position.y += vMove;
		
		var shoot = false;
		if (shooterIdx === i)
			shoot = true;
		
		arr[i].update(shoot, this.shield);
	}
	
	var self = this;
	setTimeout(function(){ self.update(); }, this.VEL_FACTOR);
}

Invasion.prototype.draw = function(){
	var arr = this.aliens;
	var arrLen = arr.length;
	
	for(var i=0; i< arrLen; i++){
		arr[i].draw();
	}
	
	/*
	this.ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);
	this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#fff';
    this.ctx.stroke();
    */
}

Invasion.prototype.buildAliensImages = function(){
	
	var opts = {
		width: 30,
		height: 30,
		states: [2,3],
		brickSize: 2		
	};
	
	opts.mapper = this.getCrabMap();
	opts.color = 'red';
	this.crabImages = ImageCreator.getImages(opts);
	
	opts.mapper = this.getSquidMap();
	opts.color = 'yellow';
	this.squidImages = ImageCreator.getImages(opts);
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
					onDestroy: function(alien){
						for(var i=0; i<self.aliens.length; i++){
							if (self.aliens[i] === alien){
								self.aliens.splice(i, 1);
								break;
							}
						}
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

//Octopus

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

Invasion.prototype.destroy = function(){
	
}
