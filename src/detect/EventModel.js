/*
==================================================================================================
  Lowland - JavaScript low level functions
  Copyright (C) 2012 Sebatian Fastner
==================================================================================================
*/
 
/*
 * Based upon code of
 *
 * Copyright (C) 2005-2012 Diego Perini
 * All rights reserved.
 *
 * nwevents.js - Javascript Event Manager
 *
 * Author: Diego Perini <diego.perini at gmail com>
 * Version: 1.2.4
 * Created: 20051016
 * Release: 20120101
 *
 * License:
 *  http://javascript.nwbox.com/NWEvents/MIT-LICENSE
 * Download:
 *  http://javascript.nwbox.com/NWEvents/nwevents.js
 */

core.Module("lowland.detect.EventModel", {
  VALUE : (function(global) {
    
    var context = global.document || {};
    var root = context.documentElement || {};
    
    var isNative = (function() {
      var s = (global.open + '').replace(/open/g, '');
      return function(object, method) {
        var m = object ? object[method] : false, r = new RegExp(method, 'g');
        return !!(m && typeof m !== 'string' && s === (m + '').replace(r, ''));
      };
    })();
    
    if (isNative(root, 'dispatchEvent') &&
        isNative(root, 'addEventListener') &&
        isNative(root, 'removeEventListener') &&
        isNative(context, 'createEvent')) {
      return "W3C";
    }
    
    if (isNative(root, 'fireEvent') &&
        isNative(root, 'attachEvent') &&
        isNative(root, 'detachEvent') &&
        isNative(context, 'createEventObject')) {
      return "MSIE";
    }
    
    return "UNKNOWN";
	})(this)
});