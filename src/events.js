function Events(core) {
  var listeners = {};

  core.on = function(name, priority, cb) {
    if (arguments.length === 2) {
      cb = priority;
      priority = 1;
    }

    if (!listeners[name]) listeners[name] = [];

    listeners[name].push({
      priority: priority,
      callback: cb
    });
    listeners[name].sort(function(a, b) {
      return a.priority > b.priority;
    });
  };

  core.trigger = function(name) {
    var ret;
    var args = _.toArray(arguments).slice(1);
    _.each(listeners[name], function(listener) {
      var r;

      r = listener.callback.apply(null, args);
      if (typeof r !== 'undefined') ret = r;
    });
    return ret;
  };
}
