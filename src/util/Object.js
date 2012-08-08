/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

core.Module("lowland.util.Object", {
	clone : function(obj) {
		var type = typeof(obj);
		
		if (type == "string") {
			return ""+obj;
		} else if (type == "number") {
			return 0+obj;
		} else if (obj instanceof Array) {
			var a = [];
			for (var j=0, jj=obj.length; j<jj; j++) {
				a[j] = obj[j];
			}
			return a;
		} else if (type == "object") {
			var c = {};
			
			var keys = Object.keys(obj);
			for (var i=0,ii=keys.length; i<ii; i++) {
				var key = keys[i];
				var e = obj[key];
				
				c[key] = lowland.util.Object.clone(e);
			}
			
			return c;
		} else {
			return obj;
		}
	}
});