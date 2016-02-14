import {HttpClient} from 'aurelia-fetch-client';
import {Rest} from './rest';

export class Config {
  endpoints        = {};
  defaultEndpoint  = null;

  /**
   * Register a new endpoint.
   *
   * @param {string}          name              The name of the new endpoint.
   * @param {function|string} [configureMethod] Configure method or endpoint.
   * @param {{}}              [defaults]        Defaults for the HttpClient
   *
   * @see http://aurelia.io/docs.html#/aurelia/fetch-client/latest/doc/api/class/HttpClientConfiguration
   * @return {Config}
   */
  registerEndpoint(name, configureMethod, defaults) {
    let newClient        = new HttpClient();
    this.endpoints[name] = new Rest(newClient);

    // Manual configure of client.
    if (typeof configureMethod === 'function') {
      newClient.configure(configureMethod);

      return this;
    }

    // Base url is self.
    if (typeof configureMethod !== 'string') {
      return this;
    }

    // Base url is string. Configure.
    newClient.configure(configure => {
      configure.withBaseUrl(configureMethod);

      // Set optional defaults.
      if (typeof defaults === 'object') {
        configure.withDefaults(defaults);
      }
    });

    return this;
  }

  /**
   * Get a previously registered endpoint. Returns null when not found.
   *
   * @param {string} [name] Returns default endpoint when not set.
   *
   * @return {Rest|null}
   */
  getEndpoint(name) {
    if (!name) {
      return this.defaultEndpoint || null;
    }

    return this.endpoints[name] || null;
  }

  /**
   * Check if an endpoint has been registered.
   *
   * @param {string} name
   *
   * @return {boolean}
   */
  endpointExists(name) {
    return !!this.endpoints[name];
  }

  /**
   * Set a previously registered endpoint as the default.
   *
   * @param {string} name
   *
   * @return {Config}
   */
  setDefaultEndpoint(name) {
    this.defaultEndpoint = this.getEndpoint(name);

    return this;
  }

  /**
   * Register interceptor for previously registered endpoint.
   *
   * @param {string} name
   * @param {object} interceptor
   *
   * @return {Config}
   */
  registerInterceptor(name, interceptor) {
    let endpoint = this.getEndpoint(name);

    if (endpoint) {
      endpoint.interceptor = interceptor;
    }

    return this;
  }
}
