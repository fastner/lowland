/*
==================================================================================================
	Lowland - JavaScript low level functions
	Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/

/**
 * #require(ext.sugar.Object)
 */
(function(global) {
	/**
	 * General base object supporting events, userdefined data, debug output and a hash system.
	 */
	core.Class("lowland.Object", {
		include : [core.property.MGeneric, lowland.base.UserData, lowland.base.NativeEvents, core.event.MEventTarget],
		
		construct : function() {
			lowland.base.UserData.call(this);
			lowland.base.NativeEvents.call(this);
			core.event.MEventTarget.call(this);
		},
		
		members : {
			debugEvents : jasy.Env.isSet("debug") ? function() {
				return {
					capture: this["__capturePhaseHandlers"],
					bubble: this["__bubblePhaseHandlers"]
				};
			} : function() { console.error("Event debugger only available in debug mode"); },

			/**
			 * Write debug messages to console.
			 */
			debug : function() {
				console.log(this.valueOf(), arguments);
			},
			
			/**
			 * Write errors to console.
			 */
			error : function() {
				console.error(this.valueOf(), arguments);
			},
			
			/**
			 * Write warnings to console.
			 */
			warn : function() {
				console.warn(this.valueOf(), arguments);
			},
			
			/**
			 * {String} Returns unique hash code pointing to this class.
			 */
			getHash : function() {
				return lowland.ObjectManager.getHash(this);
			},
			
			__coreDestructed : false,
			isCoreDestructed : function() {
				return this.__coreDestructed;
			},
			/**
			 * Destucts object
			 */
			destruct : function() {
				this.__coreDestructed = true;
				lowland.base.UserData.prototype.destruct.call(this);
				lowland.base.NativeEvents.prototype.destruct.call(this);
				this.removeAllListeners();
			},
			
			/**
			 * {String} Return unique identifier string of class
			 */
			valueOf : function() {
				return [this.constructor || this, "[", this.getHash(), "]"].join("");
			},
			
			/**
			 * {String} Return unique identifier string of class
			 */
			toString : function() {
				return this.valueOf();
			}
		}
	});
})(this);
