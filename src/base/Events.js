core.Class("lowland.base.Events", {
  implement : [core.property.IEvent],
  
  members : {
    fireEvent : function(type, value, old) {
      var events = core.Class.getEvents(this.constructor);
      var cls = events[type];
      /*if (core.Env.getValue("debug")) {
        if (!cls || !core.Class.isClass(cls)) {
          throw new Error("Class " + this.construct + " has no event " + type);
        }
      }*/
      if (!cls) {
        lowland.events.EventManager.fireEvent(this, type, cls, [value, old]);
      }
    },
    
    addListener : function(event, callback, context) {
      lowland.events.EventManager.addListener(this, event, callback, context);
    },
    
    addListenerOnce : function(event, callback, context) {
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