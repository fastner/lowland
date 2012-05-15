/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Class("lowland.events.DataEvent", {
  include : [lowland.events.Event],
  
  properties : {
    data : { nullable: true },
    oldData : { nullable: true }
  },
  
  construct : function(target, value, oldValue) {
    lowland.events.Event.call(this, target);
    
    if (value !== undefined) {
      this.setData(value);
    }
    if (oldValue !== undefined) {
      this.setOldData(oldValue);
    }
  }
});