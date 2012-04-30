(function() {
  var bound = false;
  var target = document.body;
  
  var synthesizer = function(e) {
    var delta;
    
    if (e.wheelDelta) {
      delta = e.wheelDelta / 120;
    } else if (orgEvent.detail) {
      delta = -e.detail / 3;
    }
    
    lowland.bom.Events.dispatch(e.target, "hook_mousewheel", false, { wheelDelta: delta });
    e.preventDefault();
  };
  
  var startListen = function() {
    lowland.bom.Events.set(target, "mousewheel", synthesizer, false);
  };
  
  core.Module("lowland.bom.event.MouseWheel", {
    listen : function(element, type, handler, capture) {
      if (!bound) {
        bound=true;
        startListen();
      }
      console.log("LISTEN TO HOOK hook_" + type);
      lowland.bom.Events.listen(element, "hook_"+type, handler ,capture);
    },
    unlisten : function(element, type, handler, capture) {
      lowland.bom.Events.unlisten(element, "hook_"+type, handler ,capture);
    }
  });
  
  lowland.bom.Events.registerHook("mousewheel", lowland.bom.event.MouseWheel);
})();