/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function(window) {
	var timer = null;
	var registration = [];
	var callstack = [];
	var schedule = {};
	var runState = "stop";
	var flushCallback = [];
	
	/**
	 * Generic queue manager supporting simple dependency dissolving.
	 */
	core.Module("lowland.QueueManager", {
		scheduleFlush : function() {
			if (!timer) {
				timer = lowland.ext.Function.lazy(this, this.__flush);
			}
		},
		
		flush : function() {
			if (timer) {
				lowland.ext.Function.cancelLazy(timer);
			}
			
			this.__flush();
		},
		
		register : function(name, callback, context, dependsOn) {
			if (jasy.Env.getValue("debug")) {
				if (!name) {
					throw new Error("Parameter name not set");
				}
				if (!callback) {
					throw new Error("Parameter callback not set");
				}
			}
			
			if (timer) {
				window.clearTimeout(this.timer);
			}
			
			// Make list
			registration.push({
				name: name,
				callback: callback,
				content: context,
				dependsOn: dependsOn
			});
			
			this.__calculateDependencies();
		},
		
		registerFlushCallback : function(callback) {
			flushCallback.push(callback);
		},
		
		unregisterFlushCallback : function(callback) {
			flushCallback.remove(callback);
		},
		
		__calculateDependencies : function() {
			var independent = [];
			var dependent = [];
			
			for (var i=0,ii=registration.length; i<ii; i++) {
				var item = registration[i];
				var depends = item.dependsOn;
				if (depends && "string" == typeof(depends)) {
					depends = [depends];
				}
				
				if (!depends) {
					independent.push(item.name);
				} else {
					var pos = 0;
					for (var j=0,jj=dependent.length; j<jj; j++) {
						if (core.Array.contains(depends, dependent[j])) {
							pos = j+1;
						}
					}
					core.Array.insertAt(dependent, item.name, pos);
				}
			}
			callstack = independent.concat(dependent);
		},
		
		clear : function() {
			if (timer) {
				window.clearTimeout(timer);
				timer = null;
			}
			registration = [];
			callstack = [];
			schedule = {};
		},
		
		__getCallback : function(name) {
			for (var i=0,ii=registration.length; i<ii; i++) {
				var reg = registration[i];
				if (reg.name == name) {
					return reg;
				}
			}
			
			return null;
		},
		
		run : function(name) {
			if (jasy.Env.getValue("debug")) {
				if (!name) {
					throw new Error("Parameter name not set");
				}
			}

			if (runState != "stop") {
				runState = "dirty";
			}
			schedule[name] = true;
			this.scheduleFlush();
		},
		
		__flush : function() {
			timer = null;
			
			runState = "running";
			
			for (var i=0,ii=callstack.length; i<ii; i++) {
				var key = callstack[i];
				if (key && schedule[key]) {
					var runner = this.__getCallback(key);
					if (runner) {
						schedule[key] = false;
						runner.callback.call(runner.context);
						if (runState == "dirty") {
							runState = "running";
							i=-1;
						}
					} else if (jasy.Env.getValue("debug")) {
						throw new Error("No callback for name " + name + " registered");
					}
				}
			}
			
			for (var i=0,ii=flushCallback.length; i<ii; i++) {
				flushCallback[i]();
			}
			
			runState = "stop";
		}
	});
})(window);
