/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Module("lowland.bom.Element", {
  
  getContentWidth : function(element) {
    if ((core.Env.getValue("engine") == "gecko") && (element.getBoundingClientRect)) {
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=450422
      var rect = element.getBoundingClientRect();
      return Math.round(rect.right) - Math.round(rect.left);
    } else {
      return element.offsetWidth;
    }
  },
  
  getContentHeight : function(element) {
    if ((core.Env.getValue("engine") == "gecko") && (element.getBoundingClientRect)) {
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=450422
      var rect = element.getBoundingClientRect();
      return Math.round(rect.bottom) - Math.round(rect.top);
    } else {
      return element.offsetHeight;
    }
  },
  
  getContentSize : function(element) {
    if ((core.Env.getValue("engine") == "gecko") && (element.getBoundingClientRect)) {
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=450422
      var rect = element.getBoundingClientRect();
      return  {
        width: Math.round(rect.right) - Math.round(rect.left),
        height: Math.round(rect.bottom) - Math.round(rect.top)
      };
    } else {
      return {
        width: element.offsetWidth,
        height: element.offsetHeight
      };
    }
  }
  
});