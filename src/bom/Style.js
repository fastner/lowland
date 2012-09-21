/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function() {

	var coreStyle = core.bom.Style;
	
	var setStyle;
	if (jasy.Env.isSet("engine", "trident")) {
		// In case of IE we need a try catch as browser throws exception on unknown
		// style values instead of ignoring it
		setStyle = function(element, name, value) {
			try {
				coreStyle.set(element, name, value);
			} catch (e) {}
		};
	} else {
		setStyle = coreStyle.set;
	}

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
		},
		
		set : setStyle,
		names : coreStyle.names,
		property : coreStyle.property,
		get : coreStyle.get,
		getInteger : coreStyle.getInteger,
	});

})();