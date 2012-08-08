/*
==================================================================================================
Lowland - JavaScript low level functions
Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Module("lowland.detect.IoRequest", {
	VALUE : (function(global) {
	
		if (!global.ActiveXObject) {
			try {
				new global.XMLHttpRequest();
				return "XHR";
			} catch (e) {
			}
		} else {
			if (window.location.protocol !== "file:") {
				try {
					new global.XMLHttpRequest();
					return "XHR";
				} catch (e) {
				}
			}
			
			try {
				new window.ActiveXObject("Microsoft.XMLHTTP");
							return "ACTIVEX";
			} catch(e) {
			}
		}
		
		return "NONE";
	})(this)
});