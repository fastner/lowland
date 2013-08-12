/**
 * Generic non bubling event system for core classes.
 */
(function() {
	
	core.Class("lowland.base.NativeEvents", {
		members : {
			__destructableEventsList : null,
			
			/**
			 * Add event listener on @event {String} to @element {Element}. If the event is fired the
			 * @callback {Function} is executed in @context {var?null}.
			 */
			addNativeListener : function(element, event, callback, context, capture) {
				var boundCallback;
				
				var destructableEventsList = this.__destructableEventsList;
				if (!destructableEventsList) {
					destructableEventsList = this.__destructableEventsList = [];
				}
				destructableEventsList.push([element, event, callback, context, capture]);
				
				if (!context) {
					context = this;
				}
				
				lowland.bom.Events.listen(element, event, core.Function.bind(callback, context), capture);
			},
			
			/**
			 * Remove event listener on @event {String} from @element {Element} that has @callback {Function?null} and @context {var?null} given.
			 */
			removeNativeListener : function(element, event, callback, context, capture) {
				var destructableEventsList = this.__destructableEventsList;
				if (destructableEventsList) {
					for (var i=0,ii=destructableEventsList.length; i<ii; i++) {
						var evt = destructableEventsList[i];
						if (evt[0] == element && evt[1] == event && evt[2] == callback && evt[3] == context && evt[4] == capture) {
							destructableEventsList.splice(i, 1);
							break;
						}
					}
				}
				
				if (!context) {
					context = this;
				}
				
				lowland.bom.Events.unlisten(element, event, core.Function.bind(callback, context), capture);
			},

			removeAllNativeListeners : function() {
				var destructableEventsList = this.__destructableEventsList;
				while (destructableEventsList && destructableEventsList.length > 0) {
					var evt = destructableEventsList[0];
					this.removeNativeListener.apply(this, evt);
				}
			},
	
			destruct : function() {
				this.removeAllNativeListeners();
			},
	
			debugNativeListener : jasy.Env.isSet("debug") ? lowland.bom.Events.debugEvents : undefined
		}
	});

})();
