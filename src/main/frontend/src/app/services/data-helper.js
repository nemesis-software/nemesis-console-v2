import _ from 'lodash';

export default class DataHelper {
  static mapCollectionData(data) {
    let result = [];

    if (!data) {
      return result;
    }

    _.forIn(data._embedded, (value) => result = result.concat(value));
    return result;
  }

  static mapEntityData(data) {
    if (!data) {
      return null;
    }

    return data.content && data.content.id ? data.content : data;
  }
}