/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Module("lowland.bom.Style", {
	addStyleText : function(css) {
		var st = document.createElement("style");
		var rule = document.createTextNode(css);
		st.type = "text/css";
		if (st.styleSheet) {
			st.styleSheet.cssText = rule.nodeValue;
		} else {
			st.appendChild(rule);
		}
		document.head.appendChild(st);
	}
});