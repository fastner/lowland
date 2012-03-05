
core.Module("lowland.test.events.EventManager", {
  test : function() {
    
    module("lowland.events.EventManager");
    
    var Manager = lowland.events.EventManager;
    core.Class("Testtarget", {
      include : [lowland.Object],
      construct : function() {
        lowland.Object.apply(this, arguments);
      }
    });
    var testTarget = new Testtarget();
    
    core.Class("Eventtype", {
      construct : function() {
        this.__constructParams = arguments;
      },
      
      members : {
        __constructParams : null,
        
        getConstructParams : function() {
          return this.__constructParams;
        }
      }
    });
    
    test("test for module", function() {
      ok(!!Manager, "Event manager implemented");
    });
    
    test("add events", function() {
      ok(!!Manager.addListener, "addListener function");
      
      raises(function() {
        Manager.addListener();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "addListener without parameter");
      
      raises(function() {
        Manager.addListener(testTarget);
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "addListener with one parameter");
      
      raises(function() {
        Manager.addListener(testTarget, "testevent");
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "addListener with two parameter");
    });
    
    test("has events", function() {
      ok(!!Manager.hasListener, "hasListener function");
      
      raises(function() {
        Manager.hasListener();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "addListener without parameter");
      
      raises(function() {
        Manager.hasListener(testTarget);
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "addListener with one parameter");
    });
    
    test("add and has events", function() {
      var called = false;
      
      var callback = function() {
        called = true;
      };
      
      Manager.addListener(testTarget, "testevent1", callback);
      ok(Manager.hasListener(testTarget, "testevent1"), "Has listener");
      ok(Manager.hasListener(testTarget, "testevent1", callback), "Has listener with callback");
      ok(!Manager.hasListener(testTarget, "noevent"), "Has listener that is not added");
      ok(!Manager.hasListener(testTarget, "testevent1", function() {}), "Has listener that is added but has other callback");
    });
    
    test("add and fire events", function() {
      ok(!!Manager.fireEvent, "fireEvent function");
      
      raises(function() {
        Manager.fireEvent();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "fireEvent without parameter");
      
      raises(function() {
        Manager.fireEvent(testTarget);
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "fireEvent with one parameter");
      
      
      
      var called = false;
      
      var callback = function() {
        called = true;
      };
      
      Manager.addListener(testTarget, "testevent2", callback);
      Manager.fireEvent(testTarget, "testevent2");
      ok(called, "Listener callback called");
    });
    
    test("context", function() {
      var called = false;
      var context = { id : "123" };
      
      var callback = function() {
        called = this;
      };
      
      Manager.addListener(testTarget, "testevent3", callback, context);
      Manager.fireEvent(testTarget, "testevent3");
      ok(called === context, "Listener callback called with same context");
    });
    
    test("Event type", function() {
      var called = false;
      
      var callback = function(e) {
        called = (e instanceof Eventtype);
      };
      
      Manager.addListener(testTarget, "testevent3", callback);
      Manager.fireEvent(testTarget, "testevent3", Eventtype);
      ok(called, "Listener callback called with event type class");
    });
    
    test("Event type with one parameter", function() {
      var called = false;
      
      var callback = function(e) {
        called = (e instanceof Eventtype) && (e.getConstructParams()[1] == "a");
      };
      
      Manager.addListener(testTarget, "testevent4", callback);
      Manager.fireEvent(testTarget, "testevent4", Eventtype, ["a"]);
      ok(called, "Listener callback called with event type class and one parameter");
    });
    
    test("Event type with two parameter", function() {
      var called = false;
      
      var callback = function(e) {
        called = (e instanceof Eventtype) && (e.getConstructParams()[1] == "a") && (e.getConstructParams()[2] == "z");
      };
      
      Manager.addListener(testTarget, "testevent5", callback);
      Manager.fireEvent(testTarget, "testevent5", Eventtype, ["a", "z"]);
      ok(called, "Listener callback called with event type class and one parameter");
    });
    
    test("remove events", function() {
      var fnt1 = function() {};
      var ctx1 = this;
      var ctx2 = fnt1;
      
      Manager.addListener(testTarget, "testevent5", function() {});
      Manager.addListener(testTarget, "testevent6", function() {});
      ok(Manager.hasListener(testTarget, "testevent5"), "Has listener 5");
      Manager.removeListener(testTarget, "testevent5");
      ok(!Manager.hasListener(testTarget, "testevent5"), "Has not listener 5");
      ok(Manager.hasListener(testTarget, "testevent6"), "Has listener 6");
      
      Manager.addListener(testTarget, "testevent7", function() {});
      Manager.addListener(testTarget, "testevent7", fnt1);
      ok(Manager.hasListener(testTarget, "testevent7"), "Has listener 7");
      Manager.removeListener(testTarget, "testevent7", fnt1);
      ok(Manager.hasListener(testTarget, "testevent7"), "Has listener 7");
      
      Manager.addListener(testTarget, "testevent8", fnt1, ctx1);
      Manager.addListener(testTarget, "testevent8", fnt1, ctx2);
      ok(Manager.hasListener(testTarget, "testevent8"), "Has first listener 8");
      Manager.removeListener(testTarget, "testevent8", fnt1, ctx1);
      ok(Manager.hasListener(testTarget, "testevent8"), "Has second listener 8");
      Manager.removeListener(testTarget, "testevent8", fnt1, ctx2);
      ok(!Manager.hasListener(testTarget, "testevent8"), "Has no listener 8");
    });
    
    test("remove all events", function() {
      Manager.addListener(testTarget, "testevent10", function() {});
      Manager.addListener(testTarget, "testevent10", function() {}, this);
      Manager.addListener(testTarget, "testevent11", function() {});
      Manager.addListener(testTarget, "testevent12", function() {});
      Manager.addListener(testTarget, "testevent12", function() {}, {});
      Manager.addListener(testTarget, "testevent13", function() {});
      
      ok(Manager.hasListener(testTarget, "testevent10"), "Has listener 10");
      ok(Manager.hasListener(testTarget, "testevent11"), "Has listener 11");
      ok(Manager.hasListener(testTarget, "testevent12"), "Has listener 12");
      ok(Manager.hasListener(testTarget, "testevent13"), "Has listener 13");

      Manager.removeAllListener(testTarget);
      
      ok(!Manager.hasListener(testTarget, "testevent10"), "Has no listener 10");
      ok(!Manager.hasListener(testTarget, "testevent11"), "Has no listener 11");
      ok(!Manager.hasListener(testTarget, "testevent12"), "Has no listener 12");
      ok(!Manager.hasListener(testTarget, "testevent13"), "Has no listener 13");
    });
    
    test("get target", function() {
      var callback = function(e) {
        equal(e.getTarget(), testTarget);
      };
      
      Manager.addListener(testTarget, "testevent14", callback);
      Manager.fireEvent(testTarget, "testevent14", lowland.events.Event);
    });
    
    
    
    
    /*
    test("test of register function", function() {
      ok(!!Manager.register, "Has registration function");
      
      raises(function() {
        Manager.register();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Register without parameter");
      
      raises(function() {
        Manager.register("name");
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Register with name only");
      
      raises(function() {
        Manager.register(null, function(){});
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Register with callback only");
    });
    
    test("test run of queue", function() {
      raises(function() {
        Manager.run();
      }, function(e) {
        return e.message.indexOf("Parameter") !== -1;
      }, "Run without parameter");
    });
    
    asyncTest("test of real register and run", function() {
      Manager.clear();
      var called = false;
      
      Manager.register("trr", function() {
        called = true;
      });
      
      Manager.run("trr");
      if (called) {
        ok(false, "called imediately");
        start();
      } else {
        var okFnt = function() {
          ok(called, "called delayed");
          start();
        };
        
        window.setTimeout(okFnt, 0);
      }
    });
    stop();
    
    asyncTest("test order of registered callbacks, ordered run", function() {
      Manager.clear();
      var callstack = [];
      
      Manager.register("t1", function() {
        callstack.push("t1");
      });
      Manager.register("t2", function() {
        callstack.push("t2");
      }, this, "t1");
      
      Manager.run("t1");
      Manager.run("t2");
      
      window.setTimeout(function() {
        ok(callstack.length == 2 && callstack[0] == "t1" && callstack[1] == "t2", "Order of handlers with simple dependsOn paramter is right");
        start();
      }, 10);
    });
    stop();
    
    asyncTest("test order of registered callbacks, unordered run", function() {
      Manager.clear();
      var callstack = [];
      
      Manager.register("t3", function() {
        callstack.push("t3");
      });
      Manager.register("t4", function() {
        callstack.push("t4");
      }, this, "t3");
      
      Manager.run("t4");
      Manager.run("t3");
      
      window.setTimeout(function() {
        ok(callstack.length == 2 && callstack[0] == "t3" && callstack[1] == "t4", "Order of handlers with simple dependsOn paramter is right");
        start();
      }, 10);
    });
    stop();
    
    asyncTest("test complex order of registered callbacks, unordered run", function() {
      Manager.clear();
      var callstack = [];
      
      Manager.register("t7", function() {
        callstack.push("t7");
      }, this, "t5");
      Manager.register("t8", function() {
        callstack.push("t8");
      }, this, ["t5", "t6"]);
      Manager.register("t5", function() {
        callstack.push("t5");
      });
      Manager.register("t6", function() {
        callstack.push("t6");
      }, this, "t5");
      
      Manager.run("t5");
      Manager.run("t7");
      Manager.run("t8");
      Manager.run("t6");
      
      window.setTimeout(function() {
        var c = callstack;
        ok(c.length == 4 && c[0] == "t5" && 
           (c.indexOf("t7") > c.indexOf("t5")) &&
           (c.indexOf("t8") > c.indexOf("t5")) &&
           (c.indexOf("t8") > c.indexOf("t6")) &&
           (c.indexOf("t6") > c.indexOf("t5")),
           "Order of handlers with simple dependsOn paramter is right");
        start();
      }, 10);
    });
    stop();
    
    asyncTest("test flush only once if called many times", function() {
      Manager.clear();
      var called = 0;
      
      Manager.register("t9", function() {
        called++;
      });
      
      Manager.run("t9");
      Manager.run("t9");
      Manager.run("t9");
      
      window.setTimeout(function() {
        ok(called == 1, "Real flush only called once");
        start();
      }, 10);
    });
    stop();
    
    asyncTest("test flush twice if called asynchronously after js event queue", function() {
      Manager.clear();
      var called = 0;
      
      Manager.register("t10", function() {
        called++;
      });
      
      Manager.run("t10");
      
      window.setTimeout(function() {
        Manager.run("t10");
      }, 60);
      
      window.setTimeout(function() {
        ok(called == 2, "Flush called twice -> asynchronously with enough time");
        start();
      }, 100);
    });
    stop();
    */
  }
});