/**
 * Generic non bubling event system for core classes.
 */
(function() {
	
core.Class("lowland.base.NativeEvents", {
	members : {
		/**
		 * Add event listener on @event {String} to @element {Element}. If the event is fired the
		 * @callback {Function} is executed in @context {var?null}.
		 */
		addNativeListener : function(element, event, callback, context, capture) {
			var boundCallback;
			
			if (!context) {
				context = this;
			}
			
			boundCallback = lowland.events.BindManager.bind(callback, context);
			lowland.bom.Events.listen(element, event, boundCallback, capture);
		},
		
		/**
		 * Remove event listener on @event {String} from @element {Element} that has @callback {Function?null} and @context {var?null} given.
		 */
		removeNativeListener : function(element, event, callback, context, capture) {
			if (!context) {
				context = this;
			}
			
			var boundCallback = lowland.events.BindManager.bind(callback, context);
			lowland.bom.Events.unlisten(element, event, boundCallback, capture);
		},

		debugNativeListener : jasy.Env.isSet("debug") ? lowland.bom.Events.debugEvents : undefined
	}
});

})();
