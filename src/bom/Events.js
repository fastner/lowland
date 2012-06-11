/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

/*
 * Parts are based upon blog article 
 * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
 *
 * Parts are inspiered by qooxdoo event handling
 * https://raw.github.com/qooxdoo/qooxdoo/master/framework/source/class/qx/bom/Event.js
 */
 
(function(global, core) {
  "use strict";
  
  var SUPPORT_TAGNAMES = {
    'select':'input','change':'input',
    'submit':'form','reset':'form',
    'error':'img','load':'img','abort':'img'
  };
  
  /**
   * {Boolean} Check if an event @eventName {String} is supported. Optional an @element {Element}
   * can be used to detect support on given element.
   * 
   * Based upon work from http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
   */
  var isSupported = function(eventName, element) {
    var existingElement = !!element;
    var el = existingElement ? element : document.createElement(SUPPORT_TAGNAMES[eventName] || 'div');

    eventName = 'on' + eventName;
    var isSupported = (eventName in el);
    if (!isSupported) {
      isSupported = existingElement && typeof el[eventName] == 'function';
      
      if (!isSupported) {
        el.setAttribute(eventName, 'return;');
        isSupported = typeof el[eventName] == 'function';
        
        if (existingElement) {
          el.removeAttribute(eventName);
        }
      }
    }
    el = null;
    return isSupported;
  };
  
  var dispatch = function(element, type, capture, options) {
    var evt;
    
    // dispatch for standard first
    if (core.Env.getValue("eventmodel") == "W3C") {
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(type, true, true);

      for (var key in options) {
        evt[key] = options[key];
      }
      return !element.dispatchEvent(evt);
    } else if (core.Env.getValue("eventmodel") == "MSIE") {
      // dispatch for IE
      evt = document.createEventObject();
      for (var key in options) {
        evt[key] = options[key];
      }
      return element.fireEvent("on" + type, evt);
    } else {
      if (core.Env.getValue("debug")) {
        console.warn("No method available to dispatch event " + type + " to " + element);
      }
    }
  };
  
  var append = function(element, type, handler, capture) {
    if (core.Env.getValue("eventmodel") == "W3C") {
      element.addEventListener(type, handler, !!capture);
    } else if (core.Env.getValue("eventmodel") == "MSIE") {
      element.attachEvent("on" + type, handler);
    } else if (typeof element["on" + type] != "undefined") {
      element["on" + type] = handler;
    } else {
      if (core.Env.getValue("debug")) {
        console.warn("No method available to add native listener to " + element);
      }
    }
  };
  
  var remove = function(element, type, handler, capture) {
    if (core.Env.getValue("eventmodel") == "W3C") {
      element.removeEventListener(type, handler, !!capture);
    } else if (core.Env.getValue("eventmodel") == "MSIE") {
      try {
        element.detachEvent("on" + type, handler);
      }
      catch(e)
      {
        // IE7 sometimes dispatches "unload" events on protected windows
        // Ignore the "permission denied" errors.
        if(e.number !== -2146828218) {
          throw e;
        };
      }
    } else if (typeof element["on" + type] != "undefined") {
      element["on" + type] = null;
    } else {
      if (core.Env.getValue("debug")) {
        console.warn("No method available to remove native listener from " + element);
      }
    }
  };
  
  var hooks = {};
  var registerHook = function(type, handler) {
    if (core.Env.getValue("debug") && hooks[type]) {
      console.warn("Hook for event type " + type + " already set");
    }
    hooks[type] = handler;
  };
  
  var hookListen = function(element, type, handler, capture) {
    var hook = hooks[type];
    if (hook) {
      hook.listen(element, type, handler, capture);
    } else {
      //listen(element, type, handler, capture);
      append(element, type, handler, capture);
    }
  };
  var hookUnlisten = function(element, type, handler, capture) {
    var hook = hooks[type];
    if (hook) {
      hook.listen(element, type, handler, capture);
    } else {
      //unlisten(element, type, handler, capture);
      remove(element, type, handler, capture);
    }
  };
  
  core.Module("lowland.bom.Events", {
    isSupported : isSupported,
    dispatch : dispatch,
    set : append,
    unset : remove,
    listen : hookListen,
    unlisten : hookUnlisten,
    registerHook : registerHook
  });
  
})(this, core);
