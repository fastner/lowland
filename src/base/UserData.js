/**
 * Class that add support for user defined data. Used by lowland.Object.
 */
core.Class("lowland.base.UserData", {
  construct : function() {
    this.__$$userdata = {};
  },
  
  members : {
    /**
     * Set user data @value {var} on object identified by @key {String}
     */
    setUserData : function(key, value) {
      if (core.Env.getValue("debug")) {
        if (!key) {
          throw new Error("Parameter key not set");
        }
        if (!value) {
          console.warn("Parameter value not set for key " + key);
        }
      }
      
      this.__$$userdata[key] = value;
    },
    
    /**
     * {var} Returns user data identified by @key {String}
     */
    getUserData : function(key) {
      if (core.Env.getValue("debug")) {
        if (!key) {
          throw new Error("Parameter key not set");
        }
      }
      
      return this.__$$userdata[key];
    },
    
    /**
     * Remove user data identified by @key {String}
     */
    removeUserData : function(key) {
      if (core.Env.getValue("debug")) {
        if (!key) {
          throw new Error("Parameter key not set");
        }
      }
      
      this.__$$userdata[key] = undefined;
    },
    
    /**
     * Destucts user data object
     */
    destruct : function() {
      this.__$$userdata = null;
    }
  }
});