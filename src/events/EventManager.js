/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

(function() {
  var eventStore = {};
  
  /**
   * Generic queue manager supporting simple dependency dissolving.
   */
  core.Module("lowland.events.EventManager", {
    addListener : function(target, event, callback, context) {
      if (core.Env.getValue("debug")) {
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
      
      var targetStore = eventStore[target];
      if (!targetStore) {
        targetStore = eventStore[target] = {};
      }
      
      var targetEventStore = targetStore[event];
      if (!targetEventStore) {
        targetEventStore = targetStore[event] = [];
      }
      
      targetEventStore.push([callback, context]);
    },
    
    hasListener : function(target, event, callback, context) {
      if (core.Env.getValue("debug")) {
        if (!target) {
          throw new Error("Parameter target not set");
        }
        if (!event) {
          throw new Error("Parameter event not set");
        }
      }
      
      var targetStore = eventStore[target];
      if (targetStore) {
        targetStore = targetStore[event];
        
        if (targetStore) {
          if (callback) {
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
      if (core.Env.getValue("debug")) {
        if (!target) {
          throw new Error("Parameter target not set");
        }
        if (!event) {
          throw new Error("Parameter event not set");
        }
      }
      var targetStore = eventStore[target];
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
              delete eventStore[target][event];
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
      if (core.Env.getValue("debug")) {
        if (!target) {
          throw new Error("Parameter target not set");
        }
      }
      
      delete eventStore[target];
    },
    
    fireEvent : function(target, event, eventClass, eventParameter) {
      if (core.Env.getValue("debug")) {
        if (!target) {
          throw new Error("Parameter target not set");
        }
        if (!event) {
          throw new Error("Parameter event not set");
        }
      }
      
      var etf = null;
      if (eventClass) {
        etf = function() {
          eventClass.apply(this, eventParameter);
        };
        etf.prototype = new eventClass();
      }
      
      var targetStore = eventStore[target];
      if (targetStore) {
        targetStore = targetStore[event];
        
        if (targetStore) {
          for (var i=0,ii=targetStore.length; i<ii; i++) {
            var t = targetStore[i];
            
            if (etf) {
              t[0].call(t[1], new etf());
            } else {
              t[0].call(t[1]);
            }
          }
          return true;
        }
      }
    }
  });
})();