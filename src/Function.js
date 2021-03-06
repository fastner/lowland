/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(window) {
	var slice = Array.prototype.slice;
	
	core.Module("lowland.Function", {
		/**
		 * Delays function for @time {Integer} milliseconds and after that time executes function
		 * in @context {var}.
		 */
		delay : function(time, context, func) {
			var args = [func, context, time, slice.call(arguments, 3)];
			return core.Function.timeout.apply(this, args);
		},
		
		/**
		 * {Number} Based upon work of http://dbaron.org/log/20100309-faster-timeouts
		 * Calls function lazy in @context {var}.
		 */
		lazy : function(context, fnt) {
			if (arguments.length > 2) {
				fnt = core.Function.curry.apply(this, [fnt].concat(slice.call(arguments, 2)));
			}
			return core.Function.immediate(fnt, context);
		},
		
		/**
		 * DEPRECATED! Cancel lazy request with given @id {Number}.
		 */
		cancelLazy : function(id) {
			console.warn("Deprecated");
			/*for (var i=0; i<timeouts.length; i++) {
				if (timeouts[i][3] === id) {
					timeouts.splice(i, 1);
					return true;
				}
			}
			return false;*/
		},

		curryBind : function(func, context) {
			return core.Function.curry.apply(this, [core.Function.bind(func, context)].concat(slice.call(arguments, 2)));
		}
	});
	
})(window);
