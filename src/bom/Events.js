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
	
	var CAPTURING_PHASE = 1;
	var BUBBLING_PHASE = 3;
	
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
	
	if (jasy.Env.getValue("eventmodel") == "MSIE") {
		
		var synthesizedPreventDefault = function() { this.returnValue = false;  };
		var synthesizedStopPropagation = function() { this.cancelBubble = true; };
		
		var synthesize = function(element, type, capture, options) {
			var event = {
				type: type,
				target: element,
				bubbles: true,
				cancelable: true,
				propagated: true,
				relatedTarget: null,
				currentTarget: element,
				preventDefault: synthesizedPreventDefault,
				stopPropagation: synthesizedStopPropagation,
				eventPhase: capture ? CAPTURING_PHASE : BUBBLING_PHASE,
				timeStamp: (new Date()).valueOf()
			};
			for (var i in options) {
				event[i] = options[i];
			}
			return event;
		};
		
		var propagatePhase = function(element, type, capture, options) {
			var ancestors = [];
			var node = element;
			var result = true;
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
			for (var i = 0, ii = ancestors.length; i<ii; i++) {
				// set currentTarget to current ancestor
				event.currentTarget = ancestors[i];
				// set eventPhase to the requested phase
				event.eventPhase = capture ? CAPTURING_PHASE : BUBBLING_PHASE;
				// execute listeners bound to this ancestor and set return value
				if (handleListener.call(ancestors[i], event) === false || event.returnValue === false) {
					result = false;
					break;
				}
			}
			return result;
		};
		
		var notify = function(element, type, capture, options) {
			if (typeof capture !== 'undefined') {
				return propagatePhase(element, type, !!capture, options);
			}
			return (propagatePhase(element, type, true, options) && propagatePhase(element, type, false, options));
		};
	
		var createRegistry = function() {
			return {
				items : [],
				calls : [],
				parms : []
			};
		};
		
		var registry = {};
		
		var handleListener = function(event) {
			var type = event.type;
			var valid;
			var phase = event.eventPhase;
			var result = true;
			
			if (registry[type] && registry[type].items) {
				
				// make a copy of the registry[type] array
				// since it can be modified run time by the
				// events deleting themselves or adding new
				var items = registry[type].items.slice();
				var calls = registry[type].calls.slice();
				var parms = registry[type].parms.slice();
				
				for (var i=0,ii=items.length; i<ii; i++) {
					valid = false;
					
					if (items[i] == this) {
						if (phase == CAPTURING_PHASE) {
							valid = parms[i] === true;
						} else if (phase == BUBBLING_PHASE) {
							valid = parms[i] !== true;
						} else {
							valid = true;
						}
					 
						if (valid) {
							result = calls[i].call(this, event);
							if (result === false) {
								break;
							}
						}
					}
					
				}
				
				if (result === false) {
					stopPropagation(event);
					preventDefault(event);
				}
			}
			
			return result;
		};
		
		var registerEvent = function(element, type, handler, capture) {
			if (!registry[type]) {
				registry[type] = createRegistry();
			}
			
			// append instance parameters to the registry
			registry[type].items.push(element);
			registry[type].calls.push(handler);
			registry[type].parms.push(!!capture);
		};
		
		var unregisterEvent = function(element, type, handler, capture) {
			var reg = registry[type];
			var hash = lowland.ObjectManager.getHash;
			
			if (!reg) {
				return;
			}
			
			var found = false;
			
			for (var i=0,ii=reg.items.length; i<ii; i++) {
				if (reg.items[i] === element) {
					if (hash(reg.calls[i]) == hash(handler)) {
						if (reg.parms[i] == capture) {
							found = i;
							break;
						}
					}
				}
			}
			
			if (found !== false) {
				reg.removeAt(found);
			}
		};
	}
	
	var dispatch = function(element, type, capture, options) {
		var evt;
		var keys;
		var key;
		var i,ii;
		
		// dispatch for standard first
		if (jasy.Env.getValue("eventmodel") == "W3C") {
			evt = document.createEvent("HTMLEvents");
			evt.initEvent(type, true, true);

			keys = Object.keys(options);
			for (i=0,ii=keys.length; i<ii; i++) {
				key = keys[i];
				evt[key] = options[key];
			}
			return !element.dispatchEvent(evt);
		} else if (jasy.Env.getValue("eventmodel") == "MSIE") {
			// dispatch for IE
			
			if (isSupported(type)) {
				evt = document.createEventObject();
				keys = Object.keys(options);
				for (i=0,ii=keys.length; i<ii; i++) {
					key = keys[i];
					evt[key] = options[key];
				}
				return element.fireEvent("on" + type, evt);
			} 
			
			return notify(element, type, capture, options);
			
		} else {
			if (jasy.Env.getValue("debug")) {
				console.warn("No method available to dispatch event " + type + " to " + element);
			}
		}
	};
	
	var append = function(element, type, handler, capture) {
		if (jasy.Env.getValue("eventmodel") == "W3C") {
			element.addEventListener(type, handler, !!capture);
		} else if (jasy.Env.getValue("eventmodel") == "MSIE") {
			registerEvent(element, type, handler, capture);
			element.attachEvent("on" + type, handler);
		} else if (typeof element["on" + type] != "undefined") {
			element["on" + type] = handler;
		} else {
			if (jasy.Env.getValue("debug")) {
				console.warn("No method available to add native listener to " + element);
			}
		}
	};
	
	var remove = function(element, type, handler, capture) {
		if (jasy.Env.getValue("eventmodel") == "W3C") {
			element.removeEventListener(type, handler, !!capture);
		} else if (jasy.Env.getValue("eventmodel") == "MSIE") {
			unregisterEvent(element, type, handler, capture);
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
			if (jasy.Env.getValue("debug")) {
				console.warn("No method available to remove native listener from " + element);
			}
		}
	};
	
	var hooks = {};
	var registerHook = function(type, handler) {
		if (jasy.Env.getValue("debug") && hooks[type]) {
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
	
	var stopPropagation = function(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	};
	
	var preventDefault = function(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			try {
				// See qooxdoo bug #1049
				event.keyCode = 0;
			} catch(ex) {}
			
			event.returnValue = false;
		}
	};
	
	var getTarget = function(event) {
		return event.target || event.srcElement;
	};
	
	core.Module("lowland.bom.Events", {
		isSupported : isSupported,
		dispatch : dispatch,
		set : append,
		unset : remove,
		listen : hookListen,
		unlisten : hookUnlisten,
		registerHook : registerHook,
		stopPropagation : stopPropagation,
		preventDefault : preventDefault,
		getTarget : getTarget
	});
	
})(this, core);
