/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(global) {
	
	var measureElem = null;
	
	var getMeasureElement = function() {
		if (measureElem) {
			return measureElem;
		}
		
		var doc = global.document;
		measureElem = doc.createElement("div");
		core.bom.Style.set(measureElem, {
			height: "auto",
			width: "auto",
			left: "-10000px",
			top: "-10000px",
			position: "absolute",
			overflow: "visible",
			display: "block"
		});
		
		var body = doc.body;
		body.insertBefore(measureElem, body.firstChild);
		
		return measureElem;
	};
	
	core.Module("lowland.bom.Label", {
		create : function(value, html) {
			var e = document.createElement("div");
			if (html) {
				e.setAttribute("html", "true");
			}
			lowland.bom.Label.setValue(e, value);
			return e;
		},
		
		getHtmlSize : function(content, style, width) {
			var protectStyle = {
				width: width + "px",
				whiteSpace: "normal",
				fontFamily: style.fontFamily || "",
				fontWeight: style.fontWeight || "",
				fontSize: style.fontSize || "",
				fontStyle: style.fontStyle || "",
				lineHeight: style.lineHeight || ""
			};
			var measureElement = getMeasureElement();
			core.bom.Style.set(measureElement, protectStyle);
			measureElement.innerHTML = content;
			
			return this.__measureElement(measureElement);
		},
		
		getTextSize : function(content, style) {
			var protectStyle = {
				width: "auto",
				whiteSpace: "nowrap",
				fontFamily: style.fontFamily || "",
				fontWeight: style.fontWeight || "",
				fontSize: style.fontSize || "",
				fontStyle: style.fontStyle || "",
				lineHeight: style.lineHeight || ""
			};
			var measureElement = getMeasureElement();
			core.bom.Style.set(measureElement, protectStyle);
			this.__setText(measureElement, content);
			
			return this.__measureElement(measureElement);
			
		},
		
		__measureElement : function(element) {
			var e = lowland.bom.Element.getContentSize(element);
			
			if (core.Env.getValue("engine") == "gecko") {
				// Gecko sometimes calculates one pixel too small
				e.width ++;
			}
			if (core.Env.getValue("engine") == "trident") {
				// IE9 sometimes calculates one pixel too small
				e.width ++;
			}
			
			return e;
		},
		
		setValue : function(label, content, html) {
			if (html) {
				label.innerHTML = content;
			} else {
				this.__setText(label, content);
			}
		},
		
		__setText : function(element, content) {
			if (core.Env.getValue("engine") == "trident") {
				element.innerText = content;
			} else {
				element.textContent = content;
			}
		}
	});
	
})(this);