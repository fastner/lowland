/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(global){
	
	// Based upon http://www.codeproject.com/Articles/35737/Absolute-Position-of-a-DOM-Element
	
	var userAgent = navigator.userAgent;
	
	var getIEVersion = function() {
		var rv = -1; // Return value assumes failure.
		
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(userAgent) != null)
		rv = parseFloat(RegExp.$1);
			
		return rv;
	}

	var getOperaVersion = function() {
		var rv = 0; // Default value
		if (window.opera) {
			var sver = window.opera.version();
			rv = parseFloat(sver);
		}
		return rv;
	}

	var isIENew = jasy.Env.getValue("engine") == "trident" && getIEVersion() >= 8;
	var isIEOld = jasy.Env.getValue("engine") == "trident" && !isIENew;
	
	var isFireFoxOld =  jasy.Env.getValue("engine") == "gecko" && ((userAgent.match(/firefox\/2./i) != null) || (userAgent.match(/firefox\/1./i) != null));
	var isFireFoxNew =  jasy.Env.getValue("engine") == "gecko" && !isFireFoxOld;
	
	var isChrome =  navigator.appVersion.match(/Chrome/) != null;
	var isOperaOld =  jasy.Env.getValue("engine") == "presto" && (getOperaVersion() < 10);

	var parseBorderWidth = function(width) {
		var res = 0;
		if (typeof(width) == "string" && width != null && width != "" ) {
			var p = width.indexOf("px");
			if (p >= 0) {
				res = parseInt(width.substring(0, p), 10);
			} else {
				// If no px value just use 1
				res = 1; 
			}
		}
		return res;
	}

	//returns border width for some element
	var getBorderWidth = window.getComputedStyle ? function(element) {
		var style = window.getComputedStyle(element, null);
		
		return {
			left: parseInt(style.borderLeftWidth, 10),
			top: parseInt(style.borderTopWidth, 10),
			right: parseInt(style.borderRightWidth, 10),
			bottom: parseInt(style.borderBottomWidth, 10)
		};
	} : function(element) {
		var style = element.style;
		
		var res = {
			left: parseBorderWidth(style.borderLeftWidth),
			top: parseBorderWidth(style.borderTopWidth),
			right: parseBorderWidth(style.borderRightWidth),
			bottom: parseBorderWidth(style.borderBottomWidth)
		};
		
		return res;
	}

	var getLocation = document.documentElement.getBoundingClientRect ? function(element, viewportElement) {
		
        if (!viewportElement) {
            viewportElement = document.documentElement;
        }
        
		var res = {
			left: 0,
			top: 0
		};
		
		if (!element) {
			return res;
		}
		
		if (!element.parentNode) {
			return res;
		}
		
		var box = element.getBoundingClientRect();
		var scrollLeft = viewportElement.scrollLeft;
		var scrollTop = viewportElement.scrollTop;
			
		res.left = box.left + scrollLeft;
		res.top = box.top + scrollTop;
		
		return res;
		
	} : function(element, viewportElement) {
		var res = {
			left: 0,
			top: 0
		};
		
		if (!element) {
			return res;
		}
		
		if (!element.parentNode) {
			return res;
		}
		
		res.left = element.offsetLeft;
		res.top = element.offsetTop;
		
		var parentNode = element.parentNode;
		var offsetParent = element.offsetParent;
		var borderWidth = null;
		
		
		while (offsetParent != null) {
			res.left += offsetParent.offsetLeft;
			res.top += offsetParent.offsetTop;
			
			var parentTagName = 
			offsetParent.tagName.toLowerCase();	
			
			if ((isIEOld && parentTagName != "table") || ((isFireFoxNew || isChrome) && parentTagName == "td")) {
				borderWidth = getBorderWidth(offsetParent);
				res.left += borderWidth.left;
				res.top += borderWidth.top;
			}
			
			if (offsetParent != document.body && offsetParent != document.documentElement) {
				res.left -= offsetParent.scrollLeft;
				res.top -= offsetParent.scrollTop;
			}
			
			
			//next lines are necessary to fix the problem 
			//with offsetParent
			if (jasy.Env.getValue("engine") != "trident" && !isOperaOld || isIENew) {
				while (offsetParent != parentNode && parentNode !== null) {
					res.left -= parentNode.scrollLeft;
					res.top -= parentNode.scrollTop;
					if (isFireFoxOld || jasy.Env.getValue("engine") == "webkit") {
						borderWidth = getBorderWidth(parentNode);
						res.left += borderWidth.left;
						res.top += borderWidth.top;
					}
					parentNode = parentNode.parentNode;
				}    
			}
			
			parentNode = offsetParent.parentNode;
			offsetParent = offsetParent.offsetParent;
		}
		
		return res;
	}


	var propertyHelper = {};
	var getProperty = function(property) {
		if (propertyHelper[property]) {
			return propertyHelper[property];
		}
		
		var prop = lowland.bom.Style.property(property).replace(/([A-Z])/g, '-$1').toLowerCase();
		propertyHelper[property] = prop;
		
		return prop;
	};
	
	core.Module("lowland.bom.Element", {
		
		replaceStyle : function(element, styleMap) {
			var cssText = [];
			
			for (var key in styleMap) {
				cssText.push(getProperty(key));
				cssText.push(":");
				cssText.push(styleMap[key]);
				cssText.push(";");
			}
			
			element.style.cssText = cssText.join("");
		},
		
		getContentWidth : function(element) {
			if ((jasy.Env.getValue("engine") == "gecko") && (element.getBoundingClientRect)) {
				// see https://bugzilla.mozilla.org/show_bug.cgi?id=450422
				var rect = element.getBoundingClientRect();
				return Math.round(rect.right) - Math.round(rect.left);
			} else {
				return element.offsetWidth;
			}
		},
		
		getContentHeight : function(element) {
			if ((jasy.Env.getValue("engine") == "gecko") && (element.getBoundingClientRect)) {
				// see https://bugzilla.mozilla.org/show_bug.cgi?id=450422
				var rect = element.getBoundingClientRect();
				return Math.round(rect.bottom) - Math.round(rect.top);
			} else {
				return element.offsetHeight;
			}
		},
		
		getContentSize : function(element) {
			if ((jasy.Env.getValue("engine") == "gecko") && (element.getBoundingClientRect)) {
				// see https://bugzilla.mozilla.org/show_bug.cgi?id=450422
				var rect = element.getBoundingClientRect();
				return  {
					width: Math.round(rect.right) - Math.round(rect.left),
					height: Math.round(rect.bottom) - Math.round(rect.top)
				};
			} else {
				return {
					width: element.offsetWidth,
					height: element.offsetHeight
				};
			}
		},
		
		getLocation : getLocation
		
	});

})(this);
