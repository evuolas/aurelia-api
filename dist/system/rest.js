<<<<<<< HEAD
System.register(['aurelia-fetch-client', 'aurelia-framework', 'querystring', 'extend', './utils'], function (_export) {
  'use strict';

  var HttpClient, json, inject, qs, extend, objectKeysToSnakeCase, objectKeysToCamelCase, Rest;
=======
System.register(['aurelia-fetch-client', 'querystring', 'extend'], function (_export) {
  'use strict';

  var json, qs, extend, Rest;
>>>>>>> SpoonX/master

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_aureliaFetchClient) {
      json = _aureliaFetchClient.json;
    }, function (_querystring) {
      qs = _querystring['default'];
    }, function (_extend) {
      extend = _extend['default'];
    }, function (_utils) {
      objectKeysToSnakeCase = _utils.objectKeysToSnakeCase;
      objectKeysToCamelCase = _utils.objectKeysToCamelCase;
    }],
    execute: function () {
      Rest = (function () {
        function Rest(httpClient) {
          _classCallCheck(this, Rest);

          this.convertRequestKeysToSnakeCase = true;
          this.convertResponseKeysToCamelCase = true;

          this.client = httpClient;
        }

        _createClass(Rest, [{
          key: 'request',
          value: function request(method, path, body, options) {
            var _this = this;

            var requestOptions = extend(true, {
              method: method,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }, options || {});

            if (typeof options !== 'undefined') {
              extend(true, requestOptions, options);
            }

            if (typeof body === 'object') {
              if (this.convertRequestKeysToSnakeCase) {
                body = objectKeysToSnakeCase(body);
              }

              requestOptions.body = json(body);
            }

            return this.client.fetch(path, requestOptions).then(function (response) {
              if (response.status >= 200 && response.status < 400) {

                var result = response.json()['catch'](function (error) {
                  return null;
                });

                if (_this.convertResponseKeysToCamelCase) {
                  return result.then(function (res) {
                    return objectKeysToCamelCase(res);
                  });
                }

                return result;
              }

              throw response;
            });
          }
        }, {
          key: 'find',
          value: function find(resource, criteria, options) {
            var requestPath = resource;

            if (criteria) {
              requestPath += typeof criteria !== 'object' ? '/' + criteria : '?' + qs.stringify(criteria);
            }

            return this.request('get', requestPath, undefined, options);
          }
        }, {
          key: 'post',
          value: function post(resource, body, options) {
            return this.request('post', resource, body, options);
          }
        }, {
          key: 'update',
          value: function update(resource, criteria, body, options) {
            var requestPath = resource;

            if (criteria) {
              requestPath += typeof criteria !== 'object' ? '/' + criteria : '?' + qs.stringify(criteria);
            }

            return this.request('put', requestPath, body, options);
          }
        }, {
          key: 'destroy',
          value: function destroy(resource, criteria, options) {
            var requestPath = resource;

            if (criteria) {
              requestPath += typeof criteria !== 'object' ? '/' + criteria : '?' + qs.stringify(criteria);
            }

            return this.request('delete', requestPath, undefined, options);
          }
        }, {
          key: 'create',
          value: function create(resource, body, options) {
            return this.post.apply(this, arguments);
          }
        }]);

        return Rest;
      })();

      _export('Rest', Rest);
    }
  };
});