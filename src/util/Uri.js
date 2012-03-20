core.Module("lowland.util.Uri", {
  /**
   * Split URL
   *
   * Code taken from:
   *   parseUri 1.2.2
   *   (c) Steven Levithan <stevenlevithan.com>
   *   MIT License
   *
   *
   * @param str {String} String to parse as URI
   * @param strict {Boolean} Whether to parse strictly by the rules
   * @return {Object} Map with parts of URI as properties
   */
  parseUri: function(str, strict) {
  
    var options = {
      key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
      q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };
    
    var o = options,
        m = options.parser[strict ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;
    
    while (i--) {
      uri[o.key[i]] = m[i] || "";
    }
    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
      if ($1) {
        uri[o.q.name][$1] = $2;
      }
    });
    
    return uri;
  }
});