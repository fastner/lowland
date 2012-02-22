/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Class("lowland.events.DataEvent", {
  properties : {
    data : {},
    oldData : {}
  },
  
  construct : function(value, oldValue) {
    if (value) {
      this.setData(value);
    }
    if (oldValue) {
      this.setOldData(oldValue);
    }
  }
});