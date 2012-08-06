
core.Module("lowtest.Object", {
  test : function() {
    
    module("lowland.Object");
    
    core.Class("Testevent", {});

    core.Class("EventClass", {
      include : [lowland.Object],
      construct : function() {
        lowland.Object.call(this);
      },
      events : {
        "testevent" : Testevent
      },
      members: {}
    });

    core.Class("UserDataClass", {
      include : [lowland.Object],
      
      construct : function() {
        lowland.Object.call(this);
      }
    });
    
    test("test for class", function() {
      ok(!!(new lowland.Object()), "Object implemented");
    });
    
    test("test fire event", function() {
      var eventClass = new EventClass();
      eventClass.fireEvent("testevent");
    });
    
    test("user data", function() {
      var udc = new UserDataClass();
      
      udc.setUserData("Test", "Hallo Welt");
      ok(udc.getUserData("Test") == "Hallo Welt", "User data is the same");
    });
  }
});