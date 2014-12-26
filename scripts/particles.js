
window.particles = (function(){

  var pars = [],
    //gravity = [5, 40],
    gravity = [2, 10],
    ctx,
    size;

  function rnd(from, to){
    return Math.floor((Math.random()*to)+from);
  }

  function rndM(){
    return (Math.round(Math.random()) ? 1 : -1);
  }

  function hexToRGB(c){
    if (c.indexOf('#') === -1) return c;

    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}

    return [ hexToR(c), hexToG(c), hexToB(c), 1 ];
  }

  return {
    init: function(_ctx, _size){
      ctx = _ctx;
      size = _size;
      pars = [];
    },
    create: function(pos, qty, color){
      var c = hexToRGB(color);

      for (var i=0; i < qty; i++){

        var vel = [rnd(10, 30)*rndM(), rnd(10, 30)*-1];

        pars.push({
          pos: [
            pos[0] + (rnd(1, 3)*rndM()),
            pos[1] + (rnd(1, 3)*rndM())
          ],
          vel: vel,
          c: c,
          t: 2,
        });
      }
    },
    update: function(dt){
      dt = dt/500;

      for(var i=0; i < pars.length; i++){
        var p = pars[i];

        p.t -= dt;

        p.vel[0] += gravity[0] * dt;
        p.vel[1] += gravity[1] * dt;

        p.pos[0] += p.vel[0] * dt;
        p.pos[1] += p.vel[1] * dt;

        if (p.pos[1] > size.h || p.t < 0){
          pars.splice(i, 1);
        }
        else {
          p.c[3] = p.t.toFixed(2);
        }
      }
    },
    draw: function(dt){
      for(var i=0; i < pars.length; i++){
        var p = pars[i];
        ctx.save();
        ctx.fillStyle = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',' + p.c[3] + ')';
        ctx.fillRect(p.pos[0], p.pos[1], 3, 3);
        ctx.restore();
      }
    }
  }

})();