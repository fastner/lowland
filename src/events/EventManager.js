/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function() {
	var eventStore = {};
	var forceDirectEvent = {};
	
	/**
	 * Generic queue manager supporting simple dependency dissolving.
	 */
	core.Module("lowland.events.EventManager", {
		forceDirect : function(target, event) {
			forceDirectEvent[target.getHash()+"-"+event] = 1;
		},
		
		addListener : function(target, event, callback, context) {
			if (jasy.Env.getValue("debug")) {
				if (!target) {
					throw new Error("Parameter target not set");
				}
				if (!event) {
					throw new Error("Parameter event not set");
				}
				if (!callback) {
					throw new Error("Parameter callback not set");
				}
			}
			
			var targetStore = eventStore[target.getHash()];
			if (!targetStore) {
				targetStore = eventStore[target.getHash()] = {};
			}
			
			var targetEventStore = targetStore[event];
			if (!targetEventStore) {
				targetEventStore = targetStore[event] = [];
			}
			
			targetEventStore.push([callback, context || target]);
		},
		
		hasListener : function(target, event, callback, context) {
			if (jasy.Env.getValue("debug")) {
				if (!target) {
					throw new Error("Parameter target not set");
				}
				if (!event) {
					throw new Error("Parameter event not set");
				}
			}
			
			var targetStore = eventStore[target.getHash()];
			if (targetStore) {
				targetStore = targetStore[event];
				
				if (targetStore) {
					if (callback) {
						if (!context) {
							context = target;
						}
						
						for (var i=0,ii=targetStore.length; i<ii; i++) {
							var t = targetStore[i];
							if (t[0] == callback && t[1] == context) {
								return true;
							}
						}
					} else {
						// No callback given
						return true;
					}
				}
			}
			
			return false;
		},
		
		removeListener : function(target, event, callback, context) {
			if (jasy.Env.getValue("debug")) {
				if (!target) {
					throw new Error("Parameter target not set");
				}
				if (!event) {
					throw new Error("Parameter event not set");
				}
			}
			var targetStore = eventStore[target.getHash()];
			if (targetStore) {
				if (callback) {
					targetStore = targetStore[event];
					
					if (targetStore) {
						var deleteIndex = [];
						
						for (var i=0,ii=targetStore.length; i<ii; i++) {
							var e = targetStore[i];
							
							if (context) {
								if (e[0] == callback && e[1] == context) {
									deleteIndex.push(i);
								}
							} else {
								if (e[0] == callback) {
									deleteIndex.push(i);
								}
							}
						}
						
						if (deleteIndex.length == targetStore.length) {
							delete eventStore[target.getHash()][event];
						} else {
							for (var j=deleteIndex.length-1; j>=0; j--) {
								targetStore.splice(deleteIndex[j], 1);
							}
						}
					}
				} else {
					delete targetStore[event];
				}
			}
		},
		
		removeAllListener : function(target) {
			if (jasy.Env.getValue("debug")) {
				if (!target) {
					throw new Error("Parameter target not set");
				}
			}
			
			delete eventStore[target.getHash()];
		},
		
		/**
		 * #require(lowland.ext.Function)
		 */
		fireEvent : function(target, event, eventClass, eventParameter, direct) {
			if (jasy.Env.getValue("debug")) {
				if (!target) {
					throw new Error("Parameter target not set");
				}
				if (!event) {
					throw new Error("Parameter event not set");
				}
			}
			
			var evtCls = null;
			
			var etf = null;
			if (eventClass) {
				etf = function() {
					var params = [target].concat(eventParameter);
					eventClass.apply(this, params);
				};
				etf.prototype = new eventClass();
				evtCls = new etf();
			}

			var targetHash = target.getHash();
			if (forceDirectEvent[targetHash+"-"+event] == 1) {
				direct = true;
			}

			var targetStore = eventStore[targetHash];
			if (targetStore) {
				targetStore = targetStore[event];
				
				if (targetStore) {
					for (var i=0,ii=targetStore.length; i<ii; i++) {
						var t = targetStore[i];
						
						if (t) {
							if (direct) {
								t[0].call(t[1], evtCls);
							} else {
								t[0].lazy(t[1], evtCls);
							}
						}
					}
					
					return evtCls;
				}
			}
			
			return false;
		}
	});
})();