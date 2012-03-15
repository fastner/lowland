
(function() {
  
  var XHRSpy = function(xhr, result) {
    xhr.prototype.send = function(data) {
      result.send = arguments;
      
      var self = this;
      window.setTimeout(function() {
        self.onreadystatechange && self.onreadystatechange.call(self);
      }, 50);
    };
    xhr.prototype.open = function(method, url, async, user, password) {
      result.open = {
        method: method,
        url: url,
        async: async,
        user: user,
        password: password
      };
    };
  };

  core.Module("lowland.test.bom.Xhr", {
    test : function() {
      
      module("lowland.bom.Xhr");
      
      test("test Xhr object", function() {
        var x = new lowland.bom.Xhr();
      });
      
      test("url", function() {
        var url = "http://example.com";
        var url2 = "http://example2.com";
        var x = new lowland.bom.Xhr();
        
        x.setUrl(url);
        equals(url, x.getUrl());
        
        x.setUrl(url2);
        equals(url2, x.getUrl());
      });
      
      test("method", function() {
        var method1 = "GET";
        var method2 = "POST";
        var x = new lowland.bom.Xhr();
        
        equals(method1, x.getMethod());
        
        x.setMethod(method1);
        equals(method1, x.getMethod());
        
        x.setMethod(method2);
        equals(method2, x.getMethod());
      });
      
      test("request headers", function() {
        var x = new lowland.bom.Xhr();
        
        x.setRequestHeader("X-Test", "abc");
        equals("abc", x.getRequestHeader("X-Test"));
        
        x.setRequestHeaders({
          "X-Test2" : "def",
          "X-Test3" : "ghi"
        });
        equals("def", x.getRequestHeader("X-Test2"));
        equals("ghi", x.getRequestHeader("X-Test3"));
      });
      
      test("timeout", function() {
        var x = new lowland.bom.Xhr();
        
        x.setTimeout(200);
        equals(200, x.getTimeout());
      });
      
      test("cache", function() {
        var x = new lowland.bom.Xhr();
        
        x.setCache(true);
        equals(true, x.getCache());
        
        x.setCache(false);
        equals(false, x.getCache());
      });
      
      test("user data", function() {
        var x = new lowland.bom.Xhr();
        
        x.setUserData("test1", "ab");
        x.setUserData("test2", "cd");
        
        equals("ab", x.getUserData("test1"));
        equals("cd", x.getUserData("test2"));
      });
      
      test("request data", function() {
        var data = "Body data";
        var x = new lowland.bom.Xhr();
        
        x.setRequestData(data);
        equals(data, x.getRequestData());
      });
      
      test("test for result functions", function() {
        var x = new lowland.bom.Xhr();
        equals("function", typeof x.send);
        equals("function", typeof x.getResponseText);
        equals("function", typeof x.getResponseType);
        equals("function", typeof x.getResponseXML);
        equals("function", typeof x.getStatus);
      });
      
      test("send", function() {
        var x = new lowland.bom.Xhr();
        
        x.setUrl("http://www.example.com");
        
        
        var called = false;
        XMLHttpRequest.prototype.send = function() {
          called = true;
        };
        
        x.send();
        equals(true, called);
      });
      
      test("get cycle", function() {
        var result = {};
        XHRSpy(XMLHttpRequest, result);
        
        var x = new lowland.bom.Xhr();
        x.setUrl("http://www.example.com");
        x.send();
        
        equal(true, !!result.send);
        equal("GET", result.open.method);
        equal("http://www.example.com", result.open.url);
        equal(true, result.open.async);
        equal(null, result.open.user);
      });
      
      asyncTest("done event", function() {
        var result = {};
        XHRSpy(XMLHttpRequest, result);
        
        var x = new lowland.bom.Xhr();
        x.addListener("done", function(e) {
          equal("ok", e.getData().getRequest().readyState);
          start();
        }, this);
        x.setUrl("http://www.example.com");
        x.send();
      });
      stop();
      
    }
  });

})();