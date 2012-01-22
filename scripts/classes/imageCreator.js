/**
 * @author DarkUser
 * Dependencies: Brick.js
 */

function ImageCreator(){ throw 'ImageCreator class is Static.'; };

ImageCreator.getImages = function(options){
	
	var images = [];
	var bricks = [];
	
	// B - Get parameters ---------------------------------

	var mapper = options.mapper || [];
	var w = options.width || 100;
	var h = options.height || 100;
	
	var states = options.states || [];
	var bSize = options.brickSize || 5;
	
	var color = options.color || '#000';
	
	// E - Get parameters ---------------------------------
	
	
	// B - Create CANVAS to render ------------------------
	
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	var ctx = canvas.getContext('2d');
	//TODO: delete element
	
	// E - Create CANVAS to render ------------------------
	
	
	// B - Create image from mapper -----------------------
	
	function buildBricks(){
		var arrLen = mapper.length;
		
		for(var i=0; i< arrLen; i++){
			var colLen = mapper[i].length;
			
			for(var j=0; j< colLen; j++){
				var val = mapper[i][j];
				
				if (val){
					var b = new Brick({
						ctx: ctx,
						x: (j * bSize),
						y: (i * bSize),
						width: bSize,
						height: bSize,
						color: color,
						value: val
					});
					
					bricks.push(b);
				}
			}
		}
	}
	
	// E - Create image from mapper -----------------------
	
	
	// B - Draw on canvas context and get image -----------
	
	function createImage(state){
		ctx.clearRect(0, 0, w, h);
		
		var bLen = bricks.length;
		for(var i=0; i< bLen; i++){
			if (bricks[i].value === 1 || bricks[i].value === state)
				bricks[i].draw();
		}
		
		var imgData = canvas.toDataURL("image/png");
		
		var image = new Image();
		image.src = imgData;
		
		images.push(image);
	}
	
	// E - Draw on canvas context and get image -----------
	
	
	//Run the build
	buildBricks();
	
	//Create all images for each state
	for(var i=0; i< states.length; i++){
		createImage(states[i]);						
	}
	
	// destroy all bricks created
	var i = bricks.length - 1;
	do{ bricks[i] = null; } while(i--);
	
	return images;
}

