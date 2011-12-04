/**
 * @author pjnovas
 */

var Shield = DrawableElement.extend({
	init: function(options){
		this._super(options);
		
		this.imgs = [];
		this.build();
	},
	build: function(){
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
						ctx: ctx,
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
	},
	update: function(){
		
	},
	draw: function(){
		var b = this.bricks;
		var bLen = b.length;
		
		for(var i=0; i< bLen; i++){
			b[i].draw();
		}
	},
	destroy: function(){
		
	},
	createImagesStateBricks: function(){
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
	},
	getBrickMap: function(){	
		return [ //FERNET JS
			[1,1,1,0,1,1,1,0,1,1,1,0,1,0,0,1,0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1],
			[1,0,0,0,1,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0],
			[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,0,1,1,1],
			[1,0,0,0,1,0,0,0,1,1,0,0,1,0,1,1,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1],
			[1,0,0,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,1,1,0,0,1,0,0,0,1,1,0,0,1,1,1]
		];
	},
	getBrickStateMap: function(){	
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
});
