/**
 * @author pjnovas
 */

var Invaders = Class.extend({
	init: function(options){
		this.canvas = null;
		
		this.ctx = null;
		
		this.loopInterval = 20;
		this.currentDir = [];
		
		this.shield = {};
		this.ship = {};
		this.invasion = [];
		
		this.initCanvas();
	},
	initCanvas: function(){
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
	},
	start: function(){
		var self = this;
		
		this.shield = new Shield({
			ctx: this.ctx,
			x: 100,
			y: 290,
			brickSize: 12,
			color: '#fff'
		});
		
		var cnvW = this.canvas.width;
	       
	    this.ship = new Ship({
			ctx: this.ctx,
			shield: this.shield,
			maxMoveLeft: 5,
			maxMoveRight: cnvW-10,
			x: ((cnvW-10) / 2),
			y: 370,
			color: '#1be400'
		});
		
		this.invasion = new Invasion({
			ctx: this.ctx,
			x: 20,
			y: 10,
			shield: this.shield,
			ship: this.ship
		});
		
		this.ship.invasion = this.invasion;
		
		this.currentDir = [];
		
		this.bindControls();
		this.loop();
	},
	loop: function(){
		this.update();
		this.draw();
		
		var self = this;
		setTimeout(function(){ self.loop(); }, self.loopInterval);
	},
	update: function(){
		this.shield.update();
		this.ship.update(this.currentDir);
	},
	draw: function(){
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
	
		this.shield.draw();
		this.ship.draw();
		this.invasion.draw();
	},
	bindControls: function(params){
		var self = this;
		var gameKeys = [Keyboard.Space, Keyboard.Left, Keyboard.Right];
	
		function getAction(code){
			switch (code) {
		        case Keyboard.Space: return Controls.Shoot;
		        case Keyboard.Left: return Controls.Left;
		        case Keyboard.Right: return Controls.Right;
		    }
		    
		    return null;	
		}
	
	    $(document).bind('keydown', function (event) {
	        var key = event.keyCode;
	
	        if ($.inArray(key, gameKeys) > -1) {
	        	var dir = getAction(key);
	        	
	        	if ($.inArray(dir, self.currentDir) === -1) 
	        		self.currentDir.push(dir);
	
	            event.stopPropagation();
	            event.preventDefault();
	            return false;
	        }
	    });
	
	    $(document).bind('keyup', function (event) {
	    	var key = event.keyCode;
	    	
	    	var dir = getAction(key);    	
	        var pos = $.inArray(dir, self.currentDir);
	        if (pos > -1)
	        	self.currentDir.splice(pos, 1);        
	    });
	
	},
	unbindControls: function(params){
		 $(document).unbind('keydown');
		 $(document).unbind('keyup');
	},
	destroy: function(){
		
	}
});
