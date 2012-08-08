
core.Module("lowtest.bom.Style", {
  test : function() {
    module("lowland.bom.Style");
    
    test("test for class", function() {
      var css = "color:'red';";
      
      document.head = {
        appendChild : function(element) {
          ok(false,  "add css text");
        }
      };
      
      lowland.bom.Style.addStyleText(css);
    });
    
  }
});