
core.Module("lowtest.base.UserData", {
  test : function() {
    
    module("lowland.base.UserData");
    
    test("test for class", function() {
      ok(!!(new lowland.base.UserData()), "Queue manager implemented");
    });
    
    test("test set function", function() {
      var Test = new lowland.base.UserData();
      ok(!!Test.setUserData, "Has set function");
      
      raises(function() {
        Test.setUserData();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Register without parameter");
    });
    
    test("test get function", function() {
      var Test = new lowland.base.UserData();
      ok(!!Test.getUserData, "Has get function");
      
      raises(function() {
        Test.getUserData();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Get without parameter");
    });

    test("test set and get function", function() {
      var Test = new lowland.base.UserData();
      
      Test.setUserData("a", "b");
      ok(Test.getUserData("a") == "b", "Set and get equals");
    });
    
    test("test set and remove function", function() {
      var Test = new lowland.base.UserData();
      
      Test.setUserData("a", "b");
      Test.removeUserData("a");
      ok(Test.getUserData("a") === undefined, "Set and get equals");
    });

  }
});