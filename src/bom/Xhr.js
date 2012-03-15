
(function(global) {
  
  var XHR = global.XMLHttpRequest;
  
  core.Class("lowland.bom.Xhr", {
    include : [ lowland.Object ],
    
    construct : function() {
      lowland.Object.call(this);
      
      this.__requestHeaders = {};
    },
    
    events : {
      "done" : lowland.events.DataEvent
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
      },
      
      method : {
        type: ["GET", "POST", "DELETE", "OPTIONS", "HEAD", "PUT"],
        init: "GET"
      }
    },
    
    members : {
      __requestHeaders : null,
      __data : null,
      __request : null,
      
      setRequestData : function(data) {
        this.__data = data;
      },
      
      getRequestData : function() {
        return this.__data;
      },
      
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
      },
      
      send : function() {
        var request = this.__request = XHR ? new XHR : new ActiveXObject("Microsoft.XMLHTTP");
        
        request.onreadystatechange = this._onReadyStateChange.bind(this);
        request.open(this.getMethod(), this.getUrl(), true);
        request.send();
      },
      
      getResponseText : function() {},
      getResponseType : function() {},
      getResponseXML : function() {},
      getStatus : function() {},
      
      getRequestStatus : function() {
        return this.__request;
      },
      
      _onReadyStateChange : function() {
        this.fireEvent("done", this);
      }
    }
  });
  
})(this);