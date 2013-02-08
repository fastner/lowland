/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Class("lowland.events.DataEvent", {
	include : [lowland.events.Event],
	
	construct : function() {
		lowland.events.Event.apply(this, arguments);
	}
});
