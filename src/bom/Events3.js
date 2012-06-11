/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

/*
 *
 * Parts are based upon blog article 
 * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
 *
 * Parts are based upon NWEvents by Diego Perini
 *
 * Copyright (C) 2005-2012 Diego Perini
 * All rights reserved.
 *
 * nwevents.js - Javascript Event Manager
 *
 * Author: Diego Perini <diego.perini at gmail com>
 * Version: 1.2.4
 * Created: 20051016
 * Release: 20120101
 *
 * License:
 *  http://javascript.nwbox.com/NWEvents/MIT-LICENSE
 * Download:
 *  http://javascript.nwbox.com/NWEvents/nwevents.js
 */

(function(global, core) {
  "use strict";
  
  // event phases constants
  var CUSTOM = 0;
  var CAPTURING_PHASE = 1;
  var AT_TARGET = 2;
  var BUBBLING_PHASE = 3;
  
  var SUPPORT_TAGNAMES = {
    'select':'input','change':'input',
    'submit':'form','reset':'form',
    'error':'img','load':'img','abort':'img'
  };
  
  // Listeners on events, handled by us
  var Listeners = {};
  // Save predefined event listeners
  var Predefined = {};
  
  var context = global.document || { };
  var rootEventElement = context.documentElement || { };
  
  var createEventCollection = function() {
    return {
      elements: [],
      calls: [],
      parameters: []
    };
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
  
  var getDocument = function(e) {
    return e.ownerDocument || e.document || e;
  };
  
  var getWindow = 'parentWindow' in context ? function(d) {
    return d.parentWindow || window;
  } : 'defaultView' in context && global === context.defaultView ? function(d) {
    return d.defaultView || window;
  } : global.frames ? function(d) {
    // fix for older Safari 2.0.x returning
    // [object AbstractView] instead of [window]
    if (global.frames.length === 0 && context === d) {
      return global;
    } else {
      for (var i in global.frames) {
        if (global.frames[i].document === d) {
          return global.frames[i];
        }
      }
    }
    return global;
  } : function() { return global; };
  
    // prevent default action
  var preventDefault = function() {
    this.returnValue = false;
  };

  // stop event propagation
  var stopPropagation = function() {
    this.cancelBubble = true;
  };
  
  // block any further event processing
  var stop = function(event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
    
    return false;
  };
  
  var synthesize = function(element, type, capture, options) {
    var event = {
      type: type,
      target: element,
      bubbles: true,
      cancelable: true,
      relatedTarget: null,
      currentTarget: element,
      preventDefault: preventDefault,
      stopPropagation: stopPropagation,
      eventPhase: capture ? CAPTURING_PHASE : BUBBLING_PHASE,
      timeStamp: (new Date).valueOf()
    };
    
    for (var key in options) {
      event[key] = options[key];
    }
    
    return event;
  };

  var processListeners = function(event) {
    var result = true;
    var type = event.type;
    var listeners = Listeners[type];
    
    var phase;
    var valid;
    
    var elements;
    var calls;
    var parameters;
    //if (type == "mousedown") console.log(type, listeners, listeners.elements);
    if (listeners && listeners.elements) {
      
      phase = event.eventPhase;
      
      // only AT_TARGET event.target === event.currentTarget
      if (phase !== AT_TARGET && event.target === this) {
        if (phase === CAPTURING_PHASE) {
          // If in caputring phase and target is self than capturing phase is finished
          return true;
        }
        phase = event.eventPhase = AT_TARGET;
      }
      
      // make a copy of the Listeners[type] array
      // since it can be modified run time by the
      // events deleting themselves or adding new
      elements = listeners.elements.slice();
      calls = listeners.calls.slice();
      parameters = listeners.parameters.slice();
      
      for (var i=0,ii=elements.length; i<ii; i++) {
        valid = false;
        
        if (elements[i] === this) {
          switch (phase) {
            case CAPTURING_PHASE:
            case BUBBLING_PHASE:
              if (!!parameters[i]) {
                valid = true;
              }
              break;
              
            case AT_TARGET:
              valid = true;
              break;
              
            default:
              // default is for Safari 4.x load events that may have eventPhase === 0
              valid = true;
              break;
          }
        }
        if (type == "mousedown") console.log(phase, valid);
        if (valid) {
          result = calls[i].call(this, event);
          
          if (result === false) {
            break;
          }
        }
      }
      
      if (result === false) {
        stop(event);
      }
    }
    
    return result;
  };

  // propagate event capturing or bubbling phase
  var propagatePhase = function(element, type, capture, options) {
    var result = true;
    var node = element;
    var ancestors = [];
    var event = synthesize(element, type, capture, options);
    
    // collect ancestors
    while (node) {
      ancestors.push(node);
      node = node.parentNode;
    }
    
    // capturing, reverse ancestors collection
    if (capture) {
      ancestors.reverse();
    }
    
    // execute registered handlers in fifo order
    for (var i=0, ii=ancestors.length; ii<i; i++) {
      // set currentTarget to current ancestor
      event.currentTarget = ancestors[i];
      // set eventPhase to the requested phase
      event.eventPhase = capture ? CAPTURING_PHASE : BUBBLING_PHASE;
      // execute listeners bound to this ancestor and set return value
      if (processListeners.call(ancestors[i], event) === false || event.returnValue === false) {
        result = false;
        break;
      }
    }
    
    ancestors = null;
    
    return result;
  };
  
  var notify = function(element, type, capture, options) {
    options = options || {};
    if (typeof capture !== 'undefined') {
      return propagatePhase(element, type, !!capture, options);
    }
    return (propagatePhase(element, type, true, options) &&
      propagatePhase(element, type, false, options));
  };
  
  var dispatch;
  var append;
  var remove;
  if (core.Env.getValue("eventmodel") == "W3C") {
    
    dispatch = function(element, type, capture, options) {
      options = options || {};
      
      var event;
      var d = getDocument(element);
  
      event = d.createEvent("HTMLEvents");
      event.initEvent(type, options.bubbles || true, options.cancelable || true);
      
      for (var key in options) event[key] = options[key];
      return !element.dispatchEvent(event);
      
    };
    
    append = function(element, type, handler, capture) {
      /*console.log("---\n" + type);
      console.trace();*/
      // use DOM2 event registration
      element.addEventListener(type, handler, !!capture);
    };
    
    remove = function(element, type, handler, capture) {
      element.removeEventListener(type, handler, !!capture);
    };
    
  } else if (core.Env.getValue("eventmodel") == "MSIE") {
    
    /**
     * Fix IE events to comply to W3C standards
     */
    var fixEvent = function(element, event, capture) {
      // needed for DOM0 events
      event || (event = getWindow(getDocument(element)).event);
      // bound element (listening the event)
      event.currentTarget = element;
      // fired element (triggering the event)
      event.target = event.srcElement || element;
      // add preventDefault and stopPropagation methods
      event.preventDefault = preventDefault;
      event.stopPropagation = stopPropagation;
      // bound and fired element are the same AT_TARGET
      event.eventPhase = capture ? CAPTURING_PHASE : BUBBLING_PHASE;
      // related element (routing of the event)
      event.relatedTarget =
        event[(event.target === event.fromElement ? 'to' : 'from') + 'Element'];
      // set time event was fixed
      event.timeStamp = (new Date).valueOf();
      return event;
    };
    
    dispatch = function(element, type, capture, options) {
    
      if (isSupported(type)) {
        var event = getDocument(element).createEventObject();
        event.type = type;
        event.target = element;
        event.eventPhase = CUSTOM;
        event.returnValue = true;
        event.cancelBubble = !!capture;
        event.currentTarget = element;
        event.preventDefault = preventDefault;
        event.stopPropagation = stopPropagation;
        for (var key in options) event[key] = options[key];
        
        return element.fireEvent('on' + type, fixEvent(element, event, capture));
      }
      
      return notify(element, type, capture, options);
      
    };
    
    // Wrapped handlers to fix IE event to support w3c model
    var WrappedHandlers = [];
    var getWrappedHandler = function(element, type, handler, capture, remove) {
      var found = false;
      var wrapper;
      
      for (var i=0,ii=WrappedHandlers.length; i<ii; i++) {
        wrapper = WrappedHandlers[i];
        
        if (wrapper &&
            wrapper.element === element &&
            wrapper.type === type &&
            wrapper.handler === handler &&
            wrapper.capture === capture) {
          found = true;
          break;
        }
      }
      
      var wrapperFnt;
      
      if (found) {
        wrapperFnt = wrapper.wrapper;
        
        if (remove == "remove") {
          wrapper.element = null;
          wrapper.type = null;
          wrapper.handler = null;
          wrapper.capture = null;
          
          delete WrappedHandlers[i];
        }
        
        return wrapperFnt;
      }
      
      if (remove == "remove") {
        return false;
      }
      
      wrapperFnt = function(event) {
        return handler.call(element, fixEvent(element, event, !!capture));
      };
      
      WrappedHandlers.push({
        element: element,
        type: type,
        handler: handler,
        capture: capture,
        wrapper: wrapperFnt
      });
      
      return wrapperFnt;
    };
    
    append = function(element, type, handler, capture) {
      // use MSIE event registration
      var wrappedHandler = getWrappedHandler(element, type, handler, capture);
      element.attachEvent('on' + type, wrappedHandler);
    };
    
    remove = function(element, type, handler, capture) {
      // use MSIE event registration
      var wrappedHandler = getWrappedHandler(element, type, handler, capture, "remove");
      if (wrappedHandler !== false) {
        element.detachEvent('on' + type, wrappedHandler);
      }
    };

  } else {
    
    dispatch = notify;
    append = function(element, type, handler, capture) {
      var callback = Predefined['on' + type] = element['on' + type] || new Function();
      // use DOM0 event registration
      element['on' + type] = function(event) {
        var result;
        event || (event = fixEvent(this, event, !!capture));
        result = handler.call(this, event);
        callback.call(this, event);
        return result;
      };
    };
    remove = function(element, type, handler, capture) {
      // use DOM0 event registration
      element['on' + type] = Predefined['on' + type];
      delete Predefined['on' + type];
    };
    
  }
  
  // check collection for registered event,
  // match element, handler and capture
  var isRegistered = function(registry, element, type, handler, capture) {
    var i;
    var ii;
    var found = false;
    var registryType = registry[type];
    
    if (registryType && registryType.elements) {
      for (i = 0, ii = registryType.elements.length; i < ii; i++) {
        if (registryType.elements[i] === element &&
            registryType.calls[i] === handler &&
            registryType.parameters[i] === capture) {
          found = i;
          break;
        }
      }
    }
    return found;
  };
  
  var countRegistered = function(registry, type, capture) {
    var i;
    var ii;
    var count = 0;
    var registryType = registry[type];
    
    if (registryType && registryType.elements) {
      for (i = 0, ii = registryType.elements.length; i < ii; i++) {
        if (registryType.parameters[i] === capture) {
          count++;
        }
      }
    }
    
    return count;
  };
  
  var register = function(registry, element, type, handler, capture) {
    var typeRegistry = registry[type];
    if (!typeRegistry) {
      typeRegistry = registry[type] = createEventCollection();
    }

    // append instance parameters to the registry
    typeRegistry.elements.push(element);
    typeRegistry.calls.push(handler);
    typeRegistry.parameters.push(capture);
  };
  
  // unregister an event instance and its parameters
  var unregister = function(registry, type, key) {
    var typeRegistry = registry[type];
    // remove instance parameters from the registry
    typeRegistry.elements.splice(key, 1);
    typeRegistry.calls.splice(key, 1);
    typeRegistry.parameters.splice(key, 1);
    if (typeRegistry.elements.length === 0) {
      delete registry[type];
    }
  };
  
  var listen = function(element, type, handler, capture) {
    capture == !!capture;
    register(Listeners, element, type, handler, capture);
    if (countRegistered(Listeners, type, capture) === 1) {
      //console.log("APPEND ", element, type, capture);
      append(rootEventElement, type, processListeners, capture);
    }
  };
  
  var unlisten = function(element, type, handler, capture) {
    capture = !!capture;
    var k = isRegistered(Listeners, element, type, handler, capture);
    if (k!== false) {
      if (countRegistered(Listeners, type, capture) === 1) {
        remove(rootEventElement, type, processListeners, capture);
      }
      unregister(Listeners, type, k);
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
      listen(element, type, handler, capture);
    }
  };
  var hookUnlisten = function(element, type, handler, capture) {
    var hook = hooks[type];
    if (hook) {
      hook.listen(element, type, handler, capture);
    } else {
      unlisten(element, type, handler, capture);
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
