/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(window) {

	core.Module("lowland.ext.Function", {
		/**
		 * Delays function for @time {Integer} milliseconds and after that time executes function
		 * in @context {var}.
		 */
		delay : lowland.Function.delay,
		
		/**
		 * {Number} Based upon work of http://dbaron.org/log/20100309-faster-timeouts
		 * Calls function lazy in @context {var}.
		 */
		lazy : lowland.Function.lazy,
		
		/**
		 * Cancel lazy request with given @id {Number}.
		 */
		cancelLazy : lowland.Function.cancelLazy
	});

	core.Main.addMembers("Function", {
                lowDelay : function(time, context) {
                        var args = [this, context, time].concat(slice.call(arguments, 2));
                        return core.Function.timeout.apply(this, args);
                },
                lazy : function(context) {
                        var args = [context, this].concat(slice.call(arguments,1));
                        return lowland.Function.lazy.apply(this, args);
                }
        });

})(window);
