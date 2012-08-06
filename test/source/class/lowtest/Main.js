
/**
 * #asset(qunit.css)
 * 
 * #require(lowtest.jquery)
 * #require(lowtest.qunit)
 * #require(ext.sugar.Object)
 * #require(ext.sugar.Array)
 * #require(lowland.ext.Function)
 */

var global = this;
$(function() {
  
  core.Env.define("debug", true);
  lowtest.QueueManager.test();
  lowtest.events.EventManager.test();
  lowtest.base.UserData.test();
  lowtest.base.Events.test();
  lowtest.Object.test();
  lowtest.bom.Font.test();
  lowtest.util.Base64.test();
  lowtest.bom.Xhr.test();
  lowtest.ObjectManager.test();
  lowtest.util.Object.test();
  
});