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
    
    find : function(hash) {
      return objectRegistry[hash];
    }
  });
  
})(this);