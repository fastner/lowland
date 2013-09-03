/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function() {
	"use strict";

	/* globals core */
	core.Module("lowland.detect.IoRequest", {
		VALUE : (function(global) {
		
			if (!global.ActiveXObject) {
				try {
					new global.XMLHttpRequest();
					return "XHR";
				} catch (e) {
				}
			} else {
				if (global.location.protocol !== "file:") {
					try {
						new global.XMLHttpRequest();
						return "XHR";
					} catch (e) {
					}
				}
				
				try {
					new global.ActiveXObject("Microsoft.XMLHTTP");
								return "ACTIVEX";
				} catch(e) {
				}
			}
			
			return "NONE";
		})(core.Main.getGlobal())
	});
})();
