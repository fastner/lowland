/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(global) {
  
  var objectRegistry = {};
  
  /**
   * Generic queue manager supporting simple dependency dissolving.
   */
  core.Module("lowland.ObjectManager", {
    register : function(obj) {
      objectRegistry[obj.getHash()] = obj;
    },
    
    unregister : function(obj) {
      objectRegistry[obj.getHash()] = null;
      delete objectRegistry[obj.getHash()];
    },
    
    find : function(hash) {
      return objectRegistry[hash];
    },
    
    dispose : function() {
      var keys = Object.keys(objectRegistry);
      var disposeCounter = 0;
      var length = keys.length;
      
      for (var i=length-1; i>=0; i--) {
        var key = keys[i];
        var val = objectRegistry[key];
        
        if (val && val.dispose) {
          try {
            val.dispose();
            disposeCounter++;
          } catch (e) {
            console.error(this, "Could not dispose object " + val, e);
          }
        }
        
        objectRegistry[key] = null;
        delete objectRegistry[key];
      }
      
      console.log("Disposed " + disposeCounter + " of " + length + " Objects");
    }
  });
  
})(this);