/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Class("lowland.events.Event", {
  properties : {
    data : {}
  },
  
  construct : function(target) {
    this.__target = target;
  },
  
  members : {
    __target : null,
    
    getTarget : function() {
      return this.__target;
    }
  }
});