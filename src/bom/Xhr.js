
(function(global) {
  
  var XHR = global.XMLHttpRequest;
  
  core.Class("lowland.bom.Xhr", {
    include : [ lowland.Object ],
    
    construct : function() {
      lowland.Object.call(this);
      
      this.__requestHeaders = {};
    },
    
    properties : {
      url : {
        type: "String"
      },
      
      timeout : {
        type: "Integer"
      },
      
      cache : {
        type: "Boolean"
      }
    },
    
    members : {
      __requestHeaders : null,
      
      setRequestHeader : function(key, value) {
        this.__requestHeaders[key] = value;
      },
      
      getRequestHeader : function(key) {
        return this.__requestHeaders[key];
      },
      
      setRequestHeaders : function(map) {
        for (var id in map) {
          var value = map[id];
          if (value) {
            this.__requestHeaders[id] = value;
          }
        }
      }
    }
  });
  
})(this);