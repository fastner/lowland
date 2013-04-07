/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/
(function(core, lowland) {
	core.Module("lowland.events.BindManager", {
		bind : function(callback, context) {
			console.log("lowland.events.BindManager.bind is deprecated, use core.Function.bind");
			return core.Function.bind(callback, context);
		},
		unbind : function(callback, context) {
			console.log("lowland.events.BindManager.unbind is deprecated. core.Function.bind don't need it to clear memory dependencies.");
		}
	});
})(window.core, window.lowland);
