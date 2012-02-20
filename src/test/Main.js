
/**
 * @require {lowland.test.qunit}
 * @require {core.ext.Object}
 * @require {core.ext.Array}
 * @require {lowland.ext.Function}
 */

var global = this;
$(function() {
  
  core.Env.define("debug", true);
  lowland.test.QueueManager.test();
  lowland.test.events.EventManager.test();
  lowland.test.base.UserData.test();
  lowland.test.Object.test();
  lowland.test.bom.Font.test();
  
});