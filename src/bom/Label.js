/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(global) {
  
  var measureElement = global.document.createElement("div");
  core.bom.Style.set(measureElement, {
    height: "auto",
    width: "auto",
    left: "-10000px",
    top: "-10000px",
    position: "absolute",
    overflow: "visible",
    display: "block"
  });
  
  var body = global.document.body;
  body.insertBefore(measureElement, body.firstChild);
  
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
      console.log("GET HTML SIZE");
    },
    
    getTextSize : function(content, style) {
      var protectStyle = {
        whiteSpace: "no-wrap",
        fontFamily: style.fontFamily || "",
        fontWeight: style.fontWeight || "",
        fontSize: style.fontSize || "",
        fontStyle: style.fontStyle || "",
        lineHeight: style.lineHeight || ""
      };
      core.bom.Style.set(measureElement, protectStyle);
      this.__setText(measureElement, content);
      
      return lowland.bom.Element.getContentSize(measureElement);
    },
    
    setValue : function(label, content) {
      var html = !!label.getAttribute("html");
      
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