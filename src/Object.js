/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

/**
 * #require(ext.sugar.Object)
 * #require(ext.sugar.String)
 * #require(ext.sugar.Function)
 */
(function(global) {
  var id = 0;
  
  /**
   * General base object supporting events, userdefined data, debug output and a hash system.
   */
  core.Class("lowland.Object", {
    include : [core.property.MGeneric, lowland.base.UserData, lowland.base.Events],
    
    construct : function() {
      this.$$hash = id++;
      
      lowland.base.UserData.call(this);
      lowland.base.Events.call(this);
    },
    
    members : {
      /**
       * Write debug messages to console.
       */
      debug : function() {
        console.log(this.constructor || this, arguments);
      },
      
      /**
       * Write errors to console.
       */
      error : function() {
        console.error(this.constructor || this, arguments);
      },
      
      /**
       * Write warnings to console.
       */
      warn : function() {
        console.warn(this.constructor || this, arguments);
      },
      
      /**
       * {String} Returns unique hash code pointing to this class.
       */
      getHash : function() {
        return this.$$hash;
      },
      
      /**
       * Destucts object
       */
      destruct : function() {
        lowland.base.UserData.prototype.destruct.call(this);
      }
    }
  });
})(this);