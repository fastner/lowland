/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/
(function(core, lowland) {
  var binds = {};
  
  var dbg = function() {
    console.log("Debug information for bind manager:\n");
    console.log(Object.keys(binds).length + " contexts");
    
    var callbacks = 0;
    var keys = Object.keys(binds);
    for (var i=0,ii=keys.length; i<ii; i++) {
      callbacks += binds[keys[i]].count;
    }
    
    console.log(callbacks + " callbacks");
  };
  
  core.Module("lowland.events.BindManager", {
    bind : function(callback, context) {
      var ctxHash = lowland.ObjectManager.getHash(context);
      
      var ctxBind = binds[ctxHash];
      if (!ctxBind) {
        ctxBind = binds[ctxHash] = {
          count: 0
        };
      }
      
      var cbBind = ctxBind[callback];
      if (!cbBind) {
        ctxBind.count++;
        cbBind = ctxBind[callback] = {
          count: 1,
          fnt: callback.bind(context)
        };
      } else {
        cbBind.count++;
      }
      return cbBind.fnt;
    },
    
    unbind : function(callback, context) {
      var ctxHash = lowland.ObjectManager.getHash(context);
      var ctxBind = binds[ctxHash];
      
      if (!ctxBind) {
        return false;
      }
      
      var cbBind = ctxBind[callback];
      
      if (!cbBind) {
        return false;
      }
      
      cbBind.count--;
      if (cbBind.count <= 0) {
        ctxBind[callback] = null;
        delete ctxBind[callback];
        ctxBind.count--;
        
        if (ctxBind.count <= 0) {
          binds[ctxHash] = null;
          delete binds[ctxHash];
        }
      }
    }
  });
})(window.core, window.lowland);