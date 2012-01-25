#Invaders 404
A code for fun, yet another custom HTML5 CANVAS 404 error page with the classic game Space Invaders made in JavaScript.

##How to Use
Its easy, just instanciate the class and suscribe to the events:

```js
var invaders = new Invaders404({
	onLoose: function(){
		alert('You Loose!');
	},
	onWin: function(){
		alert('You Win!');
	}
});

invaders.start(); //call it as many times you want, it cleans the browser memory ;)
```

- Browser compatibility: any browser which supports HTML5

##About the code
Prototypal OOP-like code in JavaScript - thanks to John Resig (http://ejohn.org/) for the utility to make inheritance simplier: classes/class.js.

It has a prove of concept to use no images at all. They are all generated on the fly from a JSON array map of numbers; drawing them first to a canvas and then using canvas.toDataURL("image/png") for better performance (classes/ImageCreator.js).

```js
// The Alien Crab JSON array
// 0 = transparent | 1 = static | 2 & 3 = animation states
ImageMapper.AlienCrab = function(){
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
};
```

It has also some JSON arrays to configure the Aliens Invasion and the Shield disposition...

```js
// The Aliens Invasion JSON array making the "404"
// 1 = Alien Squid | 2 = Alien Crab
ImageMapper.Invasion = function(){
	return [
		[2,2,2,2,2,2,2,2,2,2,2,2,2],
		[2,2,2,1,2,1,1,1,2,2,2,1,2],
		[2,2,1,1,2,1,2,1,2,2,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,2,1,2,1,2,1,1,1,2],
		[2,2,2,1,2,1,1,1,2,2,2,1,2],
		[2,2,2,2,2,2,2,2,2,2,2,2,2]
	];
};
```

```js
// The Shield JSON array making the "NOT FOUND"
// 1 = Shield brick
ImageMapper.Shield = function(){
	return [ 
		[1,0,0,1,0,1,1,1,0,1,1,1,0,0,0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,1,0],
		[1,1,0,1,0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1,0,1],
		[1,1,1,1,0,1,0,1,0,0,1,0,0,0,0,0,1,1,0,0,1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1],
		[1,0,1,1,0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1,0,1],
		[1,0,0,1,0,1,1,1,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,0,1,1,1,0,1,0,0,1,0,1,1,0]
	];
};
```

... so try it out, Fork me and have fun!

 

 
