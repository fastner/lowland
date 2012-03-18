
core.Module("lowland.test.util.Object", {
  test : function() {
    
    module("lowland.util.Object");
    
    test("clone of string", function() {
      var orig = "Test driven is great";
      var res = lowland.util.Object.clone(orig);
      
      equal(res, orig);
    });
    
    test("clone of integer", function() {
      var orig = 12;
      var res = lowland.util.Object.clone(orig);
      
      equal(res, orig);
    });
    
    test("clone of array", function() {
      var orig = [1, 2, 3, 4, 5];
      var res = lowland.util.Object.clone(orig);
      
      deepEqual(res, orig);
      notStrictEqual(res, orig);
    });
    
    test("clone of simple object", function() {
      var orig = {x: true, y: false, z: [1,2,3,4]};
      var res = lowland.util.Object.clone(orig);
      
      deepEqual(res, orig);
      notStrictEqual(res, orig);
    });
  }
});