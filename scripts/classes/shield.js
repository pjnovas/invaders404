/**
 * @author pjnovas
 */

//TODO: Update shield break 


function Shield(options){
	this.ctx = options.ctx;
	
	this.position = {
		x: options.x,
		y: options.y
	}
	
	this.brickSize = 6;
	this.bricks = [];	
	this.color = '#fff';
	
	this.build();
}

Shield.prototype.build = function(){
	var bSize = this.brickSize;
	var x = this.position.x;
	var y = this.position.y;
	var ctx = this.ctx;
	var color = this.color;
	
	var fernetArr = this.getBrickMap();
	var fArrLen = fernetArr.length;
	
	for(var i=0; i< fArrLen; i++){
		var fColLen = fernetArr[i].length;
		
		for(var j=0; j< fColLen; j++){
			
			if (fernetArr[i][j]){
				var b = new Brick({
					canvasCtx: ctx,
					x: (j * bSize) + x,
					y: (i * bSize) + y,
					width: bSize,
					height: bSize,
					color: color
				});
				
				this.bricks.push(b);
			}
		}
	}
}

Shield.prototype.update = function(){
	var b = this.bricks;
	var bLen = b.length;
	
	for(var i=0; i< bLen; i++){
		b[i].update();
	}
}

Shield.prototype.draw = function(){
	var b = this.bricks;
	var bLen = b.length;
	
	for(var i=0; i< bLen; i++){
		b[i].draw();
	}
}

Shield.prototype.getBrickMap = function(){	
	return [ //FERNET JS - BIGGER
		[1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,1,1,1,1,1,1],
		[1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,1,1,1,1,1,1],
		[1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0],
		[1,1,1,0,0,0,1,1,1,0,0,0,1,1,0,0,1,1,0,0,1,1,0,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1],
		[1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,1,0,1,0,1,1,0,0,1,1,1,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1],
		[1,1,0,0,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1],
		[1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,0,0,1,1,1,1,0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1],
		[1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,1,1,0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1]
	];
}
