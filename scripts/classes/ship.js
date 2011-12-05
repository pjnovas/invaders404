/**
 * @author pjnovas
 */

var Ship = DrawableElement.extend({
	init: function(options){
	    this._super(options);
	    
	    this.maxMove = {
			left: options.maxMoveLeft,
			right: options.maxMoveRight,
		};
		
		this.MOVE_FACTOR = 5;
	
		this.brickSize = 2;
		this.shootImage = null;
		this.shoots = [];
	
		this.imgs = [];
		
		var map = ImageMapper.Ship();
		
		this.size = {
			width: this.brickSize * map[0].length,
			height: this.brickSize * map.length 
		};
		
		this.build();
		
		this.shield = options.shield;
		this.invasion = {};
	},
	build: function(){
		this.buildShootImage();
		
		var opts = {
			width: this.size.width,
			height: this.size.height,
			states: [1],
			brickSize: this.brickSize,
			mapper: ImageMapper.Ship(),
			color: this.color
		};
		
		this.imgs = ImageCreator.getImages(opts);
	},
	update: function(actions){
		var vel = this.MOVE_FACTOR;
	
		if (actions.indexOf(Controls.Left)>-1){
			if (this.position.x > this.maxMove.left){
				this.position.x -= vel;
			}
		}
		else if (actions.indexOf(Controls.Right)>-1) { 
			if (this.position.x < (this.maxMove.right - this.size.width)){
				this.position.x += vel;
			}
		}
		
		var shootIdx = actions.indexOf(Controls.Shoot);
		if (shootIdx>-1 && this.shoots.length === 0){
	       	actions.splice(shootIdx, 1);
	       	this.makeShoot();
		}
	},
	draw: function(){
		this._super(this.imgs[0]);
		
		var s = this.shoots;
		var sLen = s.length;
		
		for(var i=0; i< sLen; i++){
			s[i].draw();
		}
	},
	destroy: function(){
		alert('BOOM!');
	},
	makeShoot: function(){
        var self = this;
        
		var s = new Shoot({
			ctx: this.ctx,
			x: this.position.x + (this.size.width /2),
			y: this.position.y,
			dir: -1,
			shootImage: this.shootImage,
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
	},
	buildShootImage: function(){
		var map = ImageMapper.ShipShoot(),
			brickSize = 2,
			width = brickSize * map[0].length,
			height = brickSize * map.length;
		
		var opts = {
			width: width,
			height: height,
			states: [1],
			brickSize: brickSize,
			mapper: map,
			color: this.color
		};
		
		this.shootImage = ImageCreator.getImages(opts)[0];
	}
});
