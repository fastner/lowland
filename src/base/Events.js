core.Class("lowland.base.Events", {
  implement : [core.property.IEvent],
  
  members : {
    fireEvent : function(type, value, old) {
      var events = core.Class.getEvents(this.constructor);
      var cls = events[type];
      if (core.Env.getValue("debug")) {
        if (!cls || !core.Class.isClass(cls)) {
          throw new Error("Class " + this.construct + " has no event " + type);
        }
      }
      lowland.events.EventManager.fireEvent(this, type, cls, [value, old]);
    },
    
    addListener : function(event, callback, context) {
      lowland.events.EventManager.addListener(this, event, callback, context);
    },
    
    removeListener : function(event, callback, context) {
      lowland.events.EventManager.removeListener(this, event, callback, context);
    },
    
    dispose : function() {
      lowland.events.EventManager.removeAllListener(this);
    }
  }
});