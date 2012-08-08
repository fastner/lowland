
core.Module("lowtest.bom.Style", {
	test : function() {
		module("lowland.bom.Style");
		
		test("test for class", function() {
			var css = "color:'red';";
			
			var oldAppendChild = document.head.appendChild;
			document.head.appendChild = function(element) {
				document.head.appendChild = oldAppendChild;
				ok(element.innerHTML.indexOf(css) >= 0,  "add css text");
			}
			
			lowland.bom.Style.addStyleText(css);
		});
		
	}
});