/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(global){
  
  /*var computeBodyLocation = function() {
  };
  
  var computeOffset = function() {
  };
  
  var computeScroll = function() {
  };*/
  
  var getLocation = ("getBoundingClientRect" in document.documentElement) ? 
    function(element) {
      if ( !element || !element.ownerDocument ) {
        return null;
      }
  
      if ( element === element.ownerDocument.body ) {
        //return jQuery.offset.bodyOffset( elem );
        return null;
      }
  
      try {
        box = element.getBoundingClientRect();
      } catch(e) {}
  
      var doc = element.ownerDocument,
        docElem = doc.documentElement;
  
      // Make sure we're not dealing with a disconnected DOM node
      if ( !box /*|| !jQuery.contains( docElem, elem )*/ ) {
        return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
      }
  
  
      var body = doc.body,
        win = global.window, //getWindow(doc),
        clientTop  = docElem.clientTop  || body.clientTop  || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        scrollTop  = win.pageYOffset || true /*jQuery.support.boxModel*/ && docElem.scrollTop  || body.scrollTop,
        scrollLeft = win.pageXOffset || true /*jQuery.support.boxModel*/ && docElem.scrollLeft || body.scrollLeft,
        top  = box.top  + scrollTop  - clientTop,
        left = box.left + scrollLeft - clientLeft;
  
      return { top: top, left: left };
    } : function(element) {
      return null;
    };
  
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
    },
    
    getLocation : getLocation
    
  });

})(this);