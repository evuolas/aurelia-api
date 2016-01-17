import {_} from "underscore";

export function stringToCamelCase(str) {
  return str.replace(/(_\w)/g, function(m) {
    return m[1].toUpperCase();
  });
}

export function stringToSnakeCase(str) {
  if (!_.isString(str)) {
    return str;
  }

  return str.replace(/([0-9A-Z])/g, function ($1) {
    return '_' + $1.toLowerCase();
  });
}

function manipulateKeys(obj, keyManipulator) {
  if (_.isArray(obj)) {
    return _.map(obj, function(val) {
      return _.isObject(val) ? manipulateKeys(val, keyManipulator) : val;
    });
  } else if (_.isObject(obj)) {
    let result = {};

    _.each(obj, function(val, key) {
      result[keyManipulator(key)] = _.isObject(val) ? manipulateKeys(val, keyManipulator) : val;
    });

    return result;
  }

  return obj;
}

export function objectKeysToSnakeCase(obj) {
  return manipulateKeys(obj, stringToSnakeCase);
}

export function objectKeysToCamelCase(obj) {
  return manipulateKeys(obj, stringToCamelCase);
}
