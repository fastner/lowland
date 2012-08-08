/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function() {
	var bound = false;
	var target = document.body;
	
	var synthesizer = function(e) {
		var delta;

		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		} else if (e.detail) {
			delta = -e.detail / 3;
		}
		
		lowland.bom.Events.dispatch(e.target, "hook_mousewheel", false, { wheelDelta: delta });
		lowland.bom.Events.preventDefault(e);
	};
	
	var startListen = function() {
		if (core.Env.getValue("engine") == "gecko") {
			lowland.bom.Events.set(target, "DOMMouseScroll", synthesizer, false);
		} else {
			lowland.bom.Events.set(target, "mousewheel", synthesizer, false);
		}
	};
	
	core.Module("lowland.bom.event.MouseWheel", {
		listen : function(element, type, handler, capture) {
			if (!bound) {
				bound=true;
				startListen();
			}
			lowland.bom.Events.listen(element, "hook_"+type, handler ,capture);
		},
		unlisten : function(element, type, handler, capture) {
			lowland.bom.Events.unlisten(element, "hook_"+type, handler ,capture);
		}
	});
	
	lowland.bom.Events.registerHook("mousewheel", lowland.bom.event.MouseWheel);
})();