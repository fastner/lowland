/**
 * @require {core.ext.Object}
 * @require {core.ext.String}
 * @require {core.ext.Function}
 */
core.Class("lowland.Object", {
  include : [core.property.MGeneric, lowland.base.UserData, lowland.base.Events],
  
  construct : function() {
    lowland.base.UserData.call(this);
    lowland.base.Events.call(this);
  }
});