var _dec, _class3;

import qs from 'qs';
import extend from 'extend';
import { json, HttpClient } from 'aurelia-fetch-client';
import { resolver } from 'aurelia-dependency-injection';

export let Rest = class Rest {
  constructor(httpClient) {
    this.client = httpClient;
  }

  request(method, path, body, options) {
    let requestOptions = extend(true, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: body
    }, options || {});

    if (typeof options !== 'undefined') {
      extend(true, requestOptions, options);
    }

    let interceptor = this.interceptor;

    if (interceptor && typeof interceptor.request === 'function') {
      requestOptions = interceptor.request(requestOptions);
    }

    if (typeof body === 'object') {
      requestOptions.body = json(requestOptions.body);
    }

    return this.client.fetch(path, requestOptions).then(response => {
      if (response.status >= 200 && response.status < 400) {

        let result = response.json().catch(error => null);

        if (interceptor && typeof interceptor.response === 'function') {
          return result.then(res => {
            return interceptor.response(res);
          });
        }

        return result;
      }

      throw response;
    });
  }

  find(resource, criteria, options) {
    let requestPath = resource;

    if (criteria) {
      requestPath += typeof criteria !== 'object' ? `/${ criteria }` : '?' + qs.stringify(criteria);
    }

    return this.request('get', requestPath, undefined, options);
  }

  post(resource, body, options) {
    return this.request('post', resource, body, options);
  }

  update(resource, criteria, body, options) {
    let requestPath = resource;

    if (criteria) {
      requestPath += typeof criteria !== 'object' ? `/${ criteria }` : '?' + qs.stringify(criteria);
    }

    return this.request('put', requestPath, body, options);
  }

  destroy(resource, criteria, options) {
    let requestPath = resource;

    if (criteria) {
      requestPath += typeof criteria !== 'object' ? `/${ criteria }` : '?' + qs.stringify(criteria);
    }

    return this.request('delete', requestPath, undefined, options);
  }

  create(resource, body, options) {
    return this.post(...arguments);
  }
};

export let Config = class Config {
  constructor() {
    this.endpoints = {};
    this.defaultEndpoint = null;
  }

  registerEndpoint(name, configureMethod, defaults) {
    let newClient = new HttpClient();
    this.endpoints[name] = new Rest(newClient);

    if (typeof configureMethod === 'function') {
      newClient.configure(configureMethod);

      return this;
    }

    if (typeof configureMethod !== 'string') {
      return this;
    }

    newClient.configure(configure => {
      configure.withBaseUrl(configureMethod);

      if (typeof defaults === 'object') {
        configure.withDefaults(defaults);
      }
    });

    return this;
  }

  getEndpoint(name) {
    if (!name) {
      return this.defaultEndpoint || null;
    }

    return this.endpoints[name] || null;
  }

  endpointExists(name) {
    return !!this.endpoints[name];
  }

  setDefaultEndpoint(name) {
    this.defaultEndpoint = this.getEndpoint(name);

    return this;
  }

  registerInterceptor(name, interceptor) {
    let endpoint = this.getEndpoint(name);

    if (endpoint) {
      endpoint.interceptor = interceptor;
    }

    return this;
  }
};

export let Endpoint = (_dec = resolver(), _dec(_class3 = class Endpoint {
  constructor(key) {
    this._key = key;
  }

  get(container) {
    return container.get(Config).getEndpoint(this._key);
  }

  static of(key) {
    return new Endpoint(key);
  }
}) || _class3);

function configure(aurelia, configCallback) {
  let config = aurelia.container.get(Config);

  configCallback(config);
}

export { configure, Config, Rest, Endpoint };