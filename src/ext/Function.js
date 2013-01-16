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
	var id = 0;
	
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
	
	core.Module("lowland.ext.Function", {
		/**
		 * Delays function for @time {Integer} milliseconds and after that time executes function
		 * in @context {var}.
		 */
		delay : function(time, context, func) {
			return setTimeout(function(context, func, args) {
				func.apply(context||this, args||[]);
			}, time, context, func, slice.call(arguments, 3));
		},
		
		/**
		 * {Number} Based upon work of http://dbaron.org/log/20100309-faster-timeouts
		 * Calls function lazy in @context {var}.
		 */
		lazy : function(context, fnt) {
			context = context || this;
			//timeouts.push([func, slice.call(arguments,1)]);
			var lazyId = id++;
			timeouts.push([fnt, context, slice.call(arguments,2), lazyId]);
			postMessage(messageName, "*");
			return lazyId;
		},
		
		/**
		 * Cancel lazy request with given @id {Number}.
		 */
		cancelLazy : function(id) {
			for (var i=0; i<timeouts.length; i++) {
				if (timeouts[i][3] === id) {
					timeouts.splice(i, 1);
					return true;
				}
			}
			return false;
		}
	});
	
	core.Main.addMembers("Function", {
		lowDelay : function(time, context) {
			var func = this;
			return setTimeout(function(context, args) {
				func.apply(context||this, args||[]);
			}, time, context, slice.call(arguments, 2));
		},
		lazy : function(context) {
			context = context || this;
			var lazyId = id++;
			timeouts.push([this, context, slice.call(arguments,1), lazyId]);
			postMessage(messageName, "*");
			return lazyId;
		}
	});

})(window);
