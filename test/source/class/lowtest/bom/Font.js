
core.Module("lowtest.bom.Font", {
	test : function() {
		
		module("lowland.bom.Font");
		
		test("test for class", function() {
			ok(!!(new lowland.bom.Font()), "implemented");
		});
		
		//TODO: More test to come, no implementation for now

	}
});