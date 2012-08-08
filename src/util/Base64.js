/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

// TODO : add http://stackoverflow.com/a/246813

core.Module("lowland.util.Base64", {
	utf8Encode : function(text) {
		return window.btoa(unescape(encodeURIComponent( text )));
	},
	
	encode : function(text) {
		return window.btoa(text);
	},
	
	utf8Decode : function(base64) {
		return decodeURIComponent(escape(window.atob( base64 )));
	},
	
	decode : function(base64) {
		return window.atob( base64 );
	}
});