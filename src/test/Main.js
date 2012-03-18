
/**
 * #require(lowland.test.qunit)
 * #require(ext.sugar.Object)
 * #require(ext.sugar.Array)
 * #require(lowland.ext.Function)
 */

var global = this;
$(function() {
  
  core.Env.define("debug", true);
  lowland.test.QueueManager.test();
  lowland.test.events.EventManager.test();
  lowland.test.base.UserData.test();
  lowland.test.base.Events.test();
  lowland.test.Object.test();
  lowland.test.bom.Font.test();
  lowland.test.util.Base64.test();
  lowland.test.bom.Xhr.test();
  lowland.test.ObjectManager.test();
  lowland.test.util.Object.test();
  
});