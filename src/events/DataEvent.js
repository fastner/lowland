/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Class("lowland.events.DataEvent", {
  include : [lowland.events.Event],
  
  properties : {
    data : {},
    oldData : {}
  },
  
  construct : function(target, value, oldValue) {
    lowland.events.Event.call(this, target);
    
    if (value) {
      this.setData(value);
    }
    if (oldValue) {
      this.setOldData(oldValue);
    }
  }
});