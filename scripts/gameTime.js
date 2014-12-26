// Manages the ticks for a Game Loop

window.gameTime =  {
  lastTime     : Date.now(),
  frameTime    : 0 ,
  typicalFrameTime : 20,
  minFrameTime : 12 ,
  time         : 0
};

// move the clock one tick.
// return true if new frame, false otherwise.
window.gameTime.tick = function() {
  var now = Date.now();
  var delta = now - this.lastTime;

  if (delta < this.minFrameTime ) {
    return false;
  }

  if (delta > 2 * this.typicalFrameTime) { // +1 frame if too much time elapsed
     this.frameTime = this.typicalFrameTime;
  } else {
    this.frameTime = delta;
  }

  this.time += this.frameTime;
  this.lastTime = now;

  return true;
};