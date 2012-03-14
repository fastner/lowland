core.Class("lowland.base.Events", {
  implement : [core.property.IEvent],
  
  members : {
    fireEvent : function(type, value, old) {
      this.fireSpecialEvent(type, [value, old]);
    },
    
    fireSpecialEvent : function(type, args) {
      var events = core.Class.getEvents(this.constructor);
      var cls = events[type] || lowland.events.Event;
      lowland.events.EventManager.fireEvent(this, type, cls, args);
    },
    
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
    
    removeListener : function(event, callback, context) {
      lowland.events.EventManager.removeListener(this, event, callback, context);
    },
    
    hasListener : function(event, callback, context) {
      return lowland.events.EventManager.hasListener(this, event, callback, context);
    },
    
    dispose : function() {
      lowland.events.EventManager.removeAllListener(this);
    }
  }
});