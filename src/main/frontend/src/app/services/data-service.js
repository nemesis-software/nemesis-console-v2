import ApiCall from "./api-call";
import DataHelper from "./data-helper"

export default class DataService {
  static getEntityData(restUrl, relatedEntities) {
    return ApiCall.get(restUrl).then(result => {
      let entityData = result.data;
      return Promise.all(
        (relatedEntities.map(item => result.data._links[item.name] ? ApiCall.get(result.data._links[item.name].href, {projection: 'search'})
          .then(result => {
            return Promise.resolve(result);
          }, err => {
            return Promise.resolve({data: null});
          }) : Promise.resolve({data: null})))
      ).then(result => {
      debugger;
        let relatedEntitiesResult = {};
        relatedEntities.forEach((item, index) => {
            debugger;
          let data;

          if (result[index].data && result[index].data._embedded) {
            data = DataHelper.mapCollectionData(result[index].data);
          } else {
            data = DataHelper.mapEntityData(result[index].data);
          }

          relatedEntitiesResult[item.name] = data;
        });
        entityData.customClientData = relatedEntitiesResult;
        return Promise.resolve(entityData);
      })
    });
  }
}
