import ApiCall from './api-call';

let baseUrl = null;
export default class PlatformApiCall extends ApiCall {
  static getRestUrl() {
    if (!baseUrl) {
      baseUrl = document.getElementById('actuator-base-url').getAttribute('url');
    }

    return baseUrl;
  }
}
