import ApiCall from './api-call';

let baseUrl = null;
export default class PlatformApiCall extends ApiCall {
  static getRestUrl() {
    if (!baseUrl) {
      baseUrl = document.getElementById('website-base-url').getAttribute('url') + 'platform';
    }

    return baseUrl;
  }
}