var _dec, _class3;

import qs from 'qs';
import extend from 'extend';
import { HttpClient } from 'aurelia-fetch-client';
import { resolver } from 'aurelia-dependency-injection';

export let Rest = class Rest {
  constructor(httpClient, endpoint) {
    this.defaults = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    this.client = httpClient;
    this.endpoint = endpoint;
  }

  request(method, path, body, options = {}) {
    let requestOptions = extend(true, { headers: {} }, this.defaults, options, { method, body });
    let contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];
    let interceptor = this.interceptor;

    if (interceptor && typeof interceptor.request === 'function') {
      requestOptions = interceptor.request(requestOptions);
    }

    if (typeof requestOptions.body === 'object' && contentType) {
      requestOptions.body = contentType.toLowerCase() === 'application/json' ? JSON.stringify(requestOptions.body) : qs.stringify(requestOptions.body);
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
    return this.request('GET', getRequestPath(resource, criteria), undefined, options);
  }

  post(resource, criteria, body, options) {
    return this.request('POST', getRequestPath(resource, criteria), body, options);
  }

  update(resource, criteria, body, options) {
    return this.request('PUT', getRequestPath(resource, criteria), body, options);
  }

  patch(resource, criteria, body, options) {
    return this.request('PATCH', getRequestPath(resource, criteria), body, options);
  }

  destroy(resource, criteria, options) {
    return this.request('DELETE', getRequestPath(resource, criteria), undefined, options);
  }

  create(resource, criteria, body, options) {
    return this.post(...arguments);
  }
};

function getRequestPath(resource, criteria) {
  if (typeof criteria === 'object' && criteria !== null) {
    const query = qs.stringify(criteria, {
      filter: (prefix, value) => prefix === 'id' ? undefined : value
    });
    resource += `${ criteria.id ? `/${ criteria.id }` : '' }?${ query }`;
  } else if (criteria) {
    resource += `/${ criteria }`;
  }

  return resource.replace(/\/\//g, '/');
}

export let Config = class Config {
  constructor() {
    this.endpoints = {};
    this.defaultEndpoint = null;
  }

  registerEndpoint(name, configureMethod, defaults) {
    let newClient = new HttpClient();
    this.endpoints[name] = new Rest(newClient, name);

    if (defaults !== undefined) this.endpoints[name].defaults = defaults;

    if (typeof configureMethod === 'function') {
      newClient.configure(configureMethod);

      return this;
    }

    if (typeof configureMethod !== 'string') {
      return this;
    }

    newClient.configure(configure => {
      configure.withBaseUrl(configureMethod);
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