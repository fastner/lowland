/**
 * Generic non bubling event system for core classes.
 */
(function() {
  
var nativeListeners = {};
  
core.Class("lowland.base.Events", {
  implement : [core.property.IEvent],
  
  members : {
    /**
     * Fire event @type {String} on this class with special @value {var} and @old {var} parameter.
     * This method is used by core property system to fire change events.
     */
    fireEvent : function(type, value, old) {
      this.fireSpecialEvent(type, [value, old]);
    },
    
    /**
     * Fire event @type {String} on this class with @args {Array} as event parameters.
     */
    fireSpecialEvent : function(type, args) {
      var events = core.Class.getEvents(this.constructor);
      var cls = events[type] || lowland.events.Event;
      
      lowland.events.EventManager.fireEvent(this, type, cls, args);
    },
    
    /**
     * Add event listener on @event {String} to this class. If the event is fired the
     * @callback {Function} is executed in @context {var?null}.
     */
    addListener : function(event, callback, context) {
      if (core.Env.getValue("debug")) {
        var cls = core.Class.getEvents(this.constructor)[event];
        if (!cls || !core.Class.isClass(cls)) {
          //throw new Error("Class " + this.constructor + " has no event " + type);
          console.warn("Class " + this.constructor + " has no event " + event + " to listen on");
        }
      }
      lowland.events.EventManager.addListener(this, event, callback, context);
    },
    
    /**
     * Add event listener on @event {String} to this class that is only executed once and removed afterwards. 
     * If the event is fired the @callback {Function} is executed in @context {var?null}.
     */
    addListenerOnce : function(event, callback, context) {
      if (core.Env.getValue("debug")) {
        var cls = core.Class.getEvents(this.constructor)[event];
        if (!cls || !core.Class.isClass(cls)) {
          //throw new Error("Class " + this.constructor + " has no event " + type);
          console.warn("Class " + this.constructor + " has no event " + event + " to listen on");
        }
      }
      var self = this;
      var cb = function() {
        lowland.events.EventManager.removeListener(self, event, cb, context);
        callback.apply(context, arguments);
      };
      
      lowland.events.EventManager.addListener(this, event, cb, context);
    },
    
    /**
     * Remove event listener on @event {String} from this class that has @callback {Function?null} and @context {var?null} given.
     */
    removeListener : function(event, callback, context) {
      lowland.events.EventManager.removeListener(this, event, callback, context);
    },
    
    /**
     * {Boolean} Returns if an event listener listens on @event {String} that has @callback {Function?null} and @context {var?null} given.
     */
    hasListener : function(event, callback, context) {
      return lowland.events.EventManager.hasListener(this, event, callback, context);
    },
    
    /**
     * Disposed events on class. All listeners are removed.
     */
    dispose : function() {
      lowland.events.EventManager.removeAllListener(this);
    },
    
    /**
     * Add event listener on @event {String} to @element {Element}. If the event is fired the
     * @callback {Function} is executed in @context {var?null}.
     */
    addNativeListener : function(element, event, callback, context) {
      var boundCallback;
      
      if (!context) {
        context = this;
      }
      
      boundCallback = lowland.events.BindManager.bind(callback, context);
      lowland.bom.Events.listen(element, event, boundCallback);
    },
    
    /**
     * Remove event listener on @event {String} from @element {Element} that has @callback {Function?null} and @context {var?null} given.
     */
    removeNativeListener : function(element, event, callback, context) {
      if (!context) {
        context = this;
      }
      
      var boundCallback = lowland.events.BindManager.bind(callback, context);
      lowland.bom.Events.unlisten(element, event, boundCallback);
    }
  }
});

})();