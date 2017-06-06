/**
   * Internal generic helper functions
   * ======
   *
   * */
  /**
   * =======================================================================
   * Functions borrowed from underscore.js with all the respect in the world
   * =======================================================================
   * */
 export default {
    breaker: {},
    contains: function (obj, target) {
      var found = false;

      if (obj === null) {
        return found;
      }

      if (obj instanceof Array) {
        return obj.indexOf(target) !== -1;
      }

      found = this.any(obj, function (value) {
        return value === target;
      });
      return found;
    },
    any: function (obj, iterator, context) {
      var result = false;
      if (obj === null) {
        return result;
      }
      if (obj instanceof Array) {
        return obj.some(iterator, context);
      }
      this.each(obj, function (value, index, list) {
        result = result || iterator.call(context, value, index, list);
        var itr = result;
        if (itr) {
          return this.breaker;
        }
      });
      return !!result;
    },
    each: function (obj, iterator, context) {
      var i, l, key;
      if (obj === null) {
        return;
      }
      if (obj instanceof Array) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (i = 0, l = obj.length; i < l; i += 1) {
          if (obj[i] !== undefined && iterator.call(context, obj[i], i, obj) === this.breaker) {
            return;
          }
        }
      } else {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === this.breaker) {
              return;
            }
          }
        }
      }
    },
    filter: function (obj, iterator, context) {
      var results = [];
      if (obj === null) {
        return results;
      }
      if (obj instanceof Array) {
        return obj.filter(iterator, context);
      }
      this.each(obj, function (value, index, list) {
        if (iterator.call(context, value, index, list)) {
          results[results.length] = value;
        }
      });
      return results;
    },
    difference: function (array, other) {
      return this.filter(array, function (value) {
        return !this.contains(other, value);
      }, this);
    },
    isFunction: function (obj) {
      return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    bind : function (func, context) {
      var args;
      if (!this.isFunction(func)) {
        throw new TypeError('Bind must be called on a function');
      }
      if(Function.prototype && Function.prototype.bind) {
        return func.bind.apply(func,Array.prototype.slice.call(arguments, 1));
      }
      args = Array.prototype.slice.call(arguments, 2);
      return function () {
        return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
      };
    }
  }
