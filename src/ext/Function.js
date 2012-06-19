/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

/**
 * #require(ext.sugar.Object)
 */

(function(window) {
  var hasPostMessage = !!window.postMessage;
  var slice = Array.prototype.slice;
  var timeouts = [];
  var messageName = "$$lowland-zero-timeout-message";
  
  var handleMessage = function(event) {
    if (event.source == window && event.data == messageName) {
      lowland.bom.Events.stopPropagation(event);
      if (timeouts.length > 0) {
        var timeout = timeouts.shift();

        timeout[0].apply(timeout[1], timeout[2]);
      }
    }
  };
  lowland.bom.Events.set(window, "message", handleMessage, true);
  
  core.Main.addMembers("Function", {
    
    lowDelay : function(time, context) {
      var func = this;
      return setTimeout(function(context, args) {
        func.apply(context||this, args||[]);
      }, time, context, slice.call(arguments, 2));
    },
    
    /**
     * Based upon work of http://dbaron.org/log/20100309-faster-timeouts
     */
    lazy : function(context) {
      context = context || this;
      //timeouts.push([func, slice.call(arguments,1)]);
      timeouts.push([this, context, slice.call(arguments,1)]);
      postMessage(messageName, "*");
    }
  });

})(window);