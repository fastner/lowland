/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function() {
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
      var ctxBind = binds[context];
      if (!ctxBind) {
        ctxBind = binds[context] = {
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
      var ctxBind = binds[context];
      
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
          binds[context] = null;
          delete binds[context];
        }
      }
    }
  });
})();