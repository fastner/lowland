/**
 * #require(ext.sugar.Object)
 * #require(ext.sugar.String)
 * #require(ext.sugar.Function)
 */
(function(global) {
  var id = 0;
  
  core.Class("lowland.Object", {
    include : [core.property.MGeneric, lowland.base.UserData, lowland.base.Events],
    
    construct : function() {
      this.$$hash = id++;
      
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
      },
      
      getHash : function() {
        return this.$$hash;
      }
    }
  });
})(this);