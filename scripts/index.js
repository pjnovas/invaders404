var invaders,
  gamepad;

window.addEventListener("MozGamepadConnected", function(e) {
  gamepad = new Input.Device(e.gamepad);
});

window.addEventListener('load', function(){
  initInvaders404();
});

function play (){
  var splash = document.getElementById('splash');
  splash.style.display = "none";
  splash.style.opacity = 0;

  invaders.start();
}

function showSplash(){
  invaders.drawSplash(function (){
    var splash = document.getElementById('splash');
    splash.style.display = "block";

    setInterval(function(){
      var opa = parseFloat(splash.style.opacity) || 0;
      if (opa < 1){
        splash.style.opacity = opa + 0.2;
      }
    }, 200);
  });
}

function initInvaders404(){
  invaders = new Invaders404({
          canvasId: "game-canvas",
    onLoose: function(){
      showSplash();
    },
    onWin: function(){
      showSplash();
    }
  });

  invaders.start();
}