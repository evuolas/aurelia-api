System.register(["underscore"], function (_export) {
  "use strict";

  var _;

  _export("stringToCamelCase", stringToCamelCase);

  _export("stringToSnakeCase", stringToSnakeCase);

  _export("objectKeysToSnakeCase", objectKeysToSnakeCase);

  _export("objectKeysToCamelCase", objectKeysToCamelCase);

  function stringToCamelCase(str) {
    return str.replace(/(_\w)/g, function (m) {
      return m[1].toUpperCase();
    });
  }

  function stringToSnakeCase(str) {
    if (!_.isString(str)) {
      return str;
    }

    return str.replace(/([0-9A-Z])/g, function ($1) {
      return '_' + $1.toLowerCase();
    });
  }

  function manipulateKeys(obj, keyManipulator) {
    if (_.isArray(obj)) {
      return _.map(obj, function (val) {
        return _.isObject(val) ? manipulateKeys(val, keyManipulator) : val;
      });
    } else if (_.isObject(obj)) {
      var _ret = (function () {
        var result = {};

        _.each(obj, function (val, key) {
          result[keyManipulator(key)] = _.isObject(val) ? manipulateKeys(val, keyManipulator) : val;
        });

        return {
          v: result
        };
      })();

      if (typeof _ret === "object") return _ret.v;
    }

    return obj;
  }

  function objectKeysToSnakeCase(obj) {
    return manipulateKeys(obj, stringToSnakeCase);
  }

  function objectKeysToCamelCase(obj) {
    return manipulateKeys(obj, stringToCamelCase);
  }

  return {
    setters: [function (_underscore) {
      _ = _underscore._;
    }],
    execute: function () {}
  };
});