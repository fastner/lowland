/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

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
    console.log("GET TEXT SIZE");
  },
  
  setValue : function(label, content) {
    var html = !!label.getAttribute("html");
    
    if (html) {
      label.innerHTML = content;
    } else {
      label.setAttribute("text", content);
    }
  }
});