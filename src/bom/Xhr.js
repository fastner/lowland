
(function(global) {
  
  var XHR = global.XMLHttpRequest;
  
  var READYSTATE_UNSENT = 0;
  var READYSTATE_OPENED = 1;
  var READYSTATE_HEADERS_RECEIVED = 2;
  var READYSTATE_LOADING = 3;
  var READYSTATE_DONE = 4;
  
  core.Class("lowland.bom.Xhr", {
    include : [ lowland.Object ],
    
    construct : function() {
      lowland.Object.call(this);
      
      this.__requestHeaders = {};
    },
    
    events : {
      done : lowland.events.DataEvent
    },
    
    properties : {
      url : {
        type: "String"
      },
      
      timeout : {
        type: "Integer",
        init: 10000
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
      __readyState : 0,
      __timeoutHandle : null,
      __aborted : false,
      
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
        var request = this.__request = XHR ? new XHR() : new ActiveXObject("Microsoft.XMLHTTP");
        
        request.onreadystatechange = this._onReadyStateChange.bind(this);
        request.open(this.getMethod(), this.getUrl(), true);
        request.send();
        
        this.__aborted = false;
        var timeoutHandle = this.__timeoutHandle = this.__timeoutHandler.delay(this.getTimeout());
        
        // Fixes for IE memory leaks, from core.io.Text
        if (core.Env.isSet("engine", "trident") && global.attachEvent) {
          var onUnload = function() {
            global.detachEvent("onunload", onUnload);
            request.onreadystatechange = empty;
            clearTimeout(timeoutHandle);

            // Internet Explorer will keep connections alive if we don't abort on unload
            request.abort();
          };

          global.attachEvent("onunload", onUnload);
        }
      },
      
      getResponseText : function() {
        return this.__request.responseText;
      },
      
      getResponseType : function() {
        return this.__request.getResponseHeader("Content-Type");
      },
      
      getResponseXML : function() {
        return this.__request.responseXML;
      },
      
      getStatus : function() {
        return this.__request.status;
      },
      
      getRequest : function() {
        return this.__request;
      },
      
      getReadyState : function() {
        return this.__readyState;
      },
      
      _onReadyStateChange : function() {
        var readyState = this.__readyState = this.__request.readyState;
        
        if (readyState == READYSTATE_DONE && !this.__aborted) {
          var timeoutHandle = this.__timeoutHandle;
          if (timeoutHandle) {
            global.clearTimeout(this.__timeoutHandle);
          }
          this.fireEvent("done", this);
        }
      },
      
      __timeoutHandler : function() {
        var req = this.__request;
        if (req && req.abort) {
          req.abort();
        }
        this.__aborted = true;
        
        this.fireEvent("done", this);
      }
    }
  });
  
})(this);