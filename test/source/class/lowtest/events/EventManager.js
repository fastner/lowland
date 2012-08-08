
core.Module("lowtest.events.EventManager", {
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
		
		asyncTest("add and fire events", function() {
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
				ok(true, "Listener callback called");
				start();
			};
			
			Manager.addListener(testTarget, "testevent2", callback);
			Manager.fireEvent(testTarget, "testevent2");
		});
		stop();
		
		asyncTest("context", function() {
			var called = false;
			var context = { id : "123" };
			
			var callback = function() {
				equals(context, this);
				start();
			};
			
			Manager.addListener(testTarget, "testevent3", callback, context);
			Manager.fireEvent(testTarget, "testevent3");
		});
		stop();
		
		asyncTest("Event type", function() {
			var called = false;
			
			var callback = function(e) {
				ok(e instanceof Eventtype);
				start();
			};
			
			Manager.addListener(testTarget, "testevent3", callback);
			Manager.fireEvent(testTarget, "testevent3", Eventtype);
		});
		stop();
		
		asyncTest("Event type with one parameter", function() {
			var called = false;
			
			var callback = function(e) {
				called = (e instanceof Eventtype) && (e.getConstructParams()[1] == "a");
				ok(called, "Listener callback called with event type class and one parameter");
				start();
			};
			
			Manager.addListener(testTarget, "testevent4", callback);
			Manager.fireEvent(testTarget, "testevent4", Eventtype, ["a"]);
		});
		stop();
		
		asyncTest("Event type with two parameter", function() {
			var called = false;
			
			var callback = function(e) {
				called = (e instanceof Eventtype) && (e.getConstructParams()[1] == "a") && (e.getConstructParams()[2] == "z");
				ok(called, "Listener callback called with event type class and one parameter");
				start();
			};
			
			Manager.addListener(testTarget, "testevent5", callback);
			Manager.fireEvent(testTarget, "testevent5", Eventtype, ["a", "z"]);
		});
		stop();
		
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
		
		asyncTest("get target", function() {
			var callback = function(e) {
				equal(e.getTarget(), testTarget);
				start();
			};
			
			Manager.addListener(testTarget, "testevent14", callback);
			Manager.fireEvent(testTarget, "testevent14", lowland.events.Event);
		});
		stop();
		
		asyncTest("lazy event handling", function() {
			var called = false;
			
			var callback = function() {
				called = true;
				ok("Test event fired");
				start();
			};
			
			Manager.addListener(testTarget, "testevent15", callback);
			Manager.fireEvent(testTarget, "testevent15", lowland.events.Event);
			
			equal(false, called);
		});
		stop();
	}
});