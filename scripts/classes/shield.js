/**
 * @author pjnovas
 */

function Shield(options){
	this.ctx = options.ctx;
	
	this.position = {
		x: options.x,
		y: options.y
	}
	
	this.brickSize = 12;
	this.bricks = [];	
	this.color = '#fff';
	
	this.imgs = [];
	
	this.build();
}

Shield.prototype.createImagesStateBricks = function(){
	var opts = {
		width: this.brickSize,
		height: this.brickSize,
		states: [1],
		brickSize: 2,
		color: this.color
	};
	
	var states = this.getBrickStateMap();

	for (var i=0; i< states.length; i++){
		opts.mapper = states[i];
		this.imgs.push(ImageCreator.getImages(opts)[0]);
	}
}

Shield.prototype.build = function(){
	this.createImagesStateBricks();
	
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
				var b = new ShieldBrick({
					canvasCtx: ctx,
					x: (j * bSize) + x,
					y: (i * bSize) + y,
					width: bSize,
					height: bSize,
					color: color,
					imgsState: this.imgs
				});
				
				this.bricks.push(b);
			}
		}
	}
}

Shield.prototype.update = function(){
	
}

Shield.prototype.draw = function(){	
	var b = this.bricks;
	var bLen = b.length;
	
	for(var i=0; i< bLen; i++){
		b[i].draw();
	}
}

Shield.prototype.getBrickMap = function(){	
	return [ //FERNET JS
		[1,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1],
		[1,0,0,0,1,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0],
		[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,0,1,1,1],
		[1,0,0,0,1,0,0,0,1,1,0,0,1,0,1,1,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1],
		[1,0,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,1,1,0,0,1,0,0,0,1,1,0,0,1,1,1]
	];
}

Shield.prototype.getBrickStateMap = function(){	
	return [ 
		[
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1],
			[1,1,1,1,1,1]
		],
		[
			[0,1,1,1,0,1],
			[1,1,1,0,0,0],
			[1,1,0,1,1,0],
			[0,0,1,0,1,1],
			[1,0,0,1,0,1],
			[1,1,0,0,1,1]
		],
		[
			[0,0,0,1,0,1],
			[0,0,0,0,0,0],
			[1,0,0,1,0,0],
			[0,0,1,0,1,1],
			[1,0,0,1,0,1],
			[1,1,0,0,0,0]
		]
	];
}


