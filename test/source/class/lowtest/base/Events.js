
core.Module("lowtest.base.Events", {
	test : function() {
		
		module("lowland.base.UserData");
		
		core.Class("EventTestClass", {
			include : [lowland.Object],
			construct : function() {
				lowland.Object.call(this);
			},
			events : {
				"testevent" : lowland.events.Event
			},
			members: {}
		});
		
		test("test for class", function() {
			ok(!!(new lowland.base.Events()), "Queue manager implemented");
		});
		
	}
});