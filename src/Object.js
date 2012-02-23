/**
 * #require(ext.sugar.Object)
 * #require(ext.sugar.String)
 * #require(ext.sugar.Function)
 */
core.Class("lowland.Object", {
  include : [core.property.MGeneric, lowland.base.UserData, lowland.base.Events],
  
  construct : function() {
    lowland.base.UserData.call(this);
    lowland.base.Events.call(this);
  },
  
  members : {
    debug : function() {
      console.log(this.constructor || this, arguments);
    },
    
    error : function() {
      console.error(this.constructor || this, arguments);
    },
    
    warn : function() {
      console.warn(this.constructor || this, arguments);
    }
  }
});