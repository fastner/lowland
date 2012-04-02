core.Class("lowland.base.UserData", {
  construct : function() {
    this.__$$userdata = {};
  },
  
  members : {
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
    
    getUserData : function(key) {
      if (core.Env.getValue("debug")) {
        if (!key) {
          throw new Error("Parameter key not set");
        }
      }
      
      return this.__$$userdata[key];
    },
    
    removeUserData : function(key) {
      if (core.Env.getValue("debug")) {
        if (!key) {
          throw new Error("Parameter key not set");
        }
      }
      
      this.__$$userdata[key] = undefined;
    }
  }
});