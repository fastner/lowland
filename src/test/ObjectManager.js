
core.Module("lowland.test.ObjectManager", {
  test : function() {
    
    module("lowland.ObjectRegistry");
    
    test("test for registry", function() {
      ok(lowland.ObjectManager);
    });
    
    test("test registration", function() {
      var o = new lowland.Object();
      lowland.ObjectManager.register(o);
      ok(true);
    });
    
    test("test hash code", function() {
      var o = new lowland.Object();
      lowland.ObjectManager.register(o);
      
      equal(lowland.ObjectManager.find(o.getHash()), o);
    });
  }
});