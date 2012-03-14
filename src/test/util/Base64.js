
core.Module("lowland.test.util.Base64", {
  test : function() {
    
    module("lowland.util.Base64");
    
    test("test text to base64", function() {
      var orig = "Test string";
      var result = "VGVzdCBzdHJpbmc=";
      
      equal(result, lowland.util.Base64.encode(orig));
    });
    
    test("base64 to text", function() {
      var orig = "UmV2ZXJzZSB0ZXN0";
      var result = "Reverse test";
      
      equal(result, lowland.util.Base64.decode(orig));
    });
    
    test("test utf8 text to base64", function() {
      var orig = "✓ à la mode";
      var result = "4pyTIMOgIGxhIG1vZGU=";
      
      equal(result, lowland.util.Base64.encode(orig));
    });
    
    test("base64 to utf8 text", function() {
      var orig = "4pyTIGFub3RoZXIgdGVzdA==";
      var result = "✓ another test";
      
      equal(result, lowland.util.Base64.decode(orig));
    });
  }
});