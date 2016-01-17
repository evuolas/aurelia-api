define(["exports", "underscore"], function (exports, _underscore) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.stringToCamelCase = stringToCamelCase;
  exports.stringToSnakeCase = stringToSnakeCase;
  exports.objectKeysToSnakeCase = objectKeysToSnakeCase;
  exports.objectKeysToCamelCase = objectKeysToCamelCase;

  function stringToCamelCase(str) {
    return str.replace(/(_\w)/g, function (m) {
      return m[1].toUpperCase();
    });
  }

  function stringToSnakeCase(str) {
    if (!_underscore._.isString(str)) {
      return str;
    }

    return str.replace(/([0-9A-Z])/g, function ($1) {
      return '_' + $1.toLowerCase();
    });
  }

  function manipulateKeys(obj, keyManipulator) {
    if (_underscore._.isArray(obj)) {
      return _underscore._.map(obj, function (val) {
        return _underscore._.isObject(val) ? manipulateKeys(val, keyManipulator) : val;
      });
    } else if (_underscore._.isObject(obj)) {
      var _ret = (function () {
        var result = {};

        _underscore._.each(obj, function (val, key) {
          result[keyManipulator(key)] = _underscore._.isObject(val) ? manipulateKeys(val, keyManipulator) : val;
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
});