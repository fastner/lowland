/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
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

	var nativeCurryBind = (function() {
		var p1 = 42;
		var f = function(a1) {
			return a1 === p1;
		}.bind(this, p1);
		return f();
	})();
	
	core.Module("lowland.Function", {
		/**
		 * Delays function for @time {Integer} milliseconds and after that time executes function
		 * in @context {var}.
		 */
		delay : function(time, context, func) {
			var args = [func, context, time, slice.call(arguments, 3));
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

		curryBind : nativeCurryBind ? function(func, context) {
			if (jasy.Env.isSet("debug")) {
				core.Assert.isType(func, "Function");
				core.Assert.isType(context, "Object");
			}

    			var boundName = "bound:curry:" + core.util.Id.get(func);

			return context[boundName] || (
				context[boundName] = func.bind.apply(func, [context].concat(slice.call(arguments, 2)))
			);
		} : function(func, context) {
			return core.Function.bind(core.Function.curry.apply(this, [func].concat(slice.call(arguments, 2))), context);
		};
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
