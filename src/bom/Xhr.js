
(function(global) {
  
  var XHR = global.XMLHttpRequest;
  var XDR = global.XDomainRequest;
  
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
      },
      
      async : {
        init: true
      },
      
      domainRequest : {
        type: "Boolean",
        init: false
      },
      
      overwrittenResponseType : {
        type: "String",
        init: null,
        nullable: true
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
      
      getRequestHeaders : function() {
        return this.__requestHeaders;
      },
      
      getResponseHeader : function(key) {
        var req = this.__request;
        
        if (req.readyState == 3 || req.readyState == 4) {
          return this.__request.getResponseHeader(key);
        } else {
          return null;
        }
      },
      
      send : function() {
        var domainRequest = this.getDomainRequest();
        var request;
        var xdr = false;
        
        if (this.getDomainRequest()) {
          
          if (XDR) {
            request = this.__request = new XDR();
          	request.onload = this.__onDone.bind(this);
          	xdr = true;
          } else if (core.Env.getValue("io.request") == "XHR") {
          	request = this.__request = new XHR();
          	request.onreadystatechange = this._onReadyStateChange.bind(this);
          } else if (core.Env.getValue("io.request") == "ACTIVEX") {
            request = this.__request = new ActiveXObject("Microsoft.XMLHTTP");
            request.onreadystatechange = this._onReadyStateChange.bind(this);
          }
          
        } else {
        	if (core.Env.getValue("io.request") == "XHR") {
        		request = this.__request = new XHR();
        	} else if (core.Env.getValue("io.request") == "ACTIVEX") {
        		request = this.__request = new ActiveXObject("Microsoft.XMLHTTP");
        	}
          request.onreadystatechange = this._onReadyStateChange.bind(this);
        }
        request.open(this.getMethod(), this.getUrl(), true);
            
        if (!xdr) {
          var respType = this.getOverwrittenResponseType();
          if (respType && respType !== "") {
            request.responseType = respType;
          }
          
          var requestHeaders = this.__requestHeaders;
          for (var key in requestHeaders) {
            var value = requestHeaders[key];
            request.setRequestHeader(key, value);
          }
          if (!requestHeaders["Content-Type"]) {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          }
        }
        
        if (this.__data) {
          request.send(this.__data);
        } else {
          request.send();
        }
        
        this.__aborted = false;
        var timeoutHandle = this.__timeoutHandle = this.__timeoutHandler.lowDelay(this.getTimeout(), this);
        
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
      
      __onDone : function() {
        var timeoutHandle = this.__timeoutHandle;
        if (timeoutHandle) {
          global.clearTimeout(this.__timeoutHandle);
        }
        this.fireEvent("done", "done");
      },
      
      _onReadyStateChange : function() {
        var readyState = this.__readyState = this.__request.readyState;
        
        if (readyState == READYSTATE_DONE && !this.__aborted) {
          this.__onDone();
        }
      },
      
      __timeoutHandler : function() {
        var req = this.__request;
        if (req && req.abort) {
          req.abort();
        }
        this.__aborted = true;

        this.fireEvent("done", "timeout");
      },
      
      __toUriParameter : function(key, value, parts, post) {
        var encode = window.encodeURIComponent;
        if (post) {
          parts.push(encode(key).replace(/%20/g, "+") + "=" +
            encode(value).replace(/%20/g, "+"));
        } else {
          parts.push(encode(key) + "=" + encode(value));
        }
      },
      
      urlify : function(obj, post) {
        var key,
            parts = [];
  
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (value instanceof Array) {
              for (var i=0; i<value.length; i++) {
                this.__toUriParameter(key, value[i], parts, post);
              }
            } else {
              this.__toUriParameter(key, value, parts, post);
            }
          }
        }
  
        return parts.join("&");
      }
    }
  });
  
})(this);
