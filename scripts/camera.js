
window.camera = (function(){

  var pars = [],
    t = 0.1,
    currT = 0,
    pos = [0, 0];

  function rnd(from, to){
    return Math.floor((Math.random()*to)+from);
  }

  function rndM(){
    return (Math.round(Math.random()) ? 1 : -1);
  }

  return {
    pos: function(){
      return [pos[0], pos[1]];
    },
    shake: function(powa){
      powa = powa || 3;
      currT = t;
      pos = [ rnd(-powa, powa), rnd(-powa, powa) ];
    },
    update: function(dt){
      dt = dt/1000;
      currT -= dt;

      if (currT < 0){
        pos = [0, 0];
      }
      else {
        pos[0] *= rndM();
        pos[1] *= rndM();
      }
    }
  }

})();