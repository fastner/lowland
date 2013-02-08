/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Class("lowland.events.Event", {
	include : [core.event.Simple],

	construct : function() {
		core.event.Simple.apply(this, arguments);
	}
});
