import qs from 'qs';
import extend from 'extend';

/**
 * Rest class. A simple rest client to fetch resources
 */
export class Rest {
  interceptor;

  defaults = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  /**
   * Inject the httpClient to use for requests.
   *
   * @param {HttpClient} httpClient The httpClient to use
   * @param {string}     [endpoint] The endpoint name
   */
  constructor(httpClient, endpoint) {
    this.client   = httpClient;
    this.endpoint = endpoint;
  }

  /**
   * Make a request to the server.
   *
   * @param {string} method     The fetch method
   * @param {string} path       Path to the resource
   * @param {{}}     [body]     The body to send if applicable
   * @param {{}}     [options]  Fetch options overwrites
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  request(method, path, body, options = {}) {
    let requestOptions = extend(true, {headers: {}}, this.defaults, options, {method, body});

    let contentType = requestOptions.headers['Content-Type'] || requestOptions.headers['content-type'];

    if (typeof body === 'object' && contentType) {
      requestOptions.body = contentType.toLowerCase() === 'application/json'
                          ? JSON.stringify(body)
                          : qs.stringify(body);
    }

    const interceptor = this.interceptor;

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

  /**
   * Find a resource.
   *
   * @param {string}           resource  Resource to find in
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}               [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  find(resource, criteria, options) {
    let requestPath = resource;

    if (criteria) {
      requestPath += typeof criteria !== 'object' ? `/${criteria}` : '?' + qs.stringify(criteria);
    }

    return this.request('GET', requestPath, undefined, options);
  }

  /**
   * Create a new instance for resource.
   *
   * @param {string} resource  Resource to create
   * @param {{}}     body      The data to post (as Object)
   * @param {{}}     [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  post(resource, body, options) {
    return this.request('POST', resource, body, options);
  }

  /**
   * Update a resource.
   *
   * @param {string}           resource  Resource to update
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {object}           body      New data for provided criteria.
   * @param {{}}               [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  update(resource, criteria, body, options) {
    let requestPath = resource;

    if (criteria) {
      requestPath += typeof criteria !== 'object' ? `/${criteria}` : '?' + qs.stringify(criteria);
    }

    return this.request('PUT', requestPath, body, options);
  }

  /**
   * Patch a resource.
   *
   * @param {string}           resource  Resource to patch
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {object}           body      Data to patch for provided criteria.
   * @param {{}}               [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  patch(resource, criteria, body, options) {
    let requestPath = resource;

    if (criteria) {
      requestPath += typeof criteria !== 'object' ? `/${criteria}` : '?' + qs.stringify(criteria);
    }

    return this.request('PATCH', requestPath, body, options);
  }

  /**
   * Delete a resource.
   *
   * @param {string}           resource  The resource to delete
   * @param {{}|string|Number} criteria  Object for where clause, string / number for id.
   * @param {{}}               [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  destroy(resource, criteria, options) {
    let requestPath = resource;

    if (criteria) {
      requestPath += typeof criteria !== 'object' ? `/${criteria}` : '?' + qs.stringify(criteria);
    }

    return this.request('DELETE', requestPath, undefined, options);
  }

  /**
   * Create a new instance for resource.
   *
   * @param {string} resource  The resource to create
   * @param {{}}     body      The data to post (as Object)
   * @param {{}}     [options] Extra fetch options.
   *
   * @return {Promise<Object>|Promise<Error>} Server response as Object
   */
  create(resource, body, options) {
    return this.post(...arguments);
  }
}
