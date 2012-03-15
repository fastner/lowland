
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
    
    test("members of XHR object", function() {
      var x = new lowland.bom.Xhr();
      
      equals("function", typeof x.setRequestData);
      equals("function", typeof x.send);
      equals("function", typeof x.getResponseText);
      equals("function", typeof x.getResponseType);
      equals("function", typeof x.getResponseXML);
      equals("function", typeof x.getStatus);
    });
  }
});