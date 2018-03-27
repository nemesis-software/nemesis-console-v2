import _ from 'lodash';

export default class MigrationService {
  static printEntityConfig(entityData) {
    let data = '';
    data += 'entityConfig,code,xtype\n';
    _.forIn(entityData, (value, key) => {
      data += `,${key},${value.xtype}\n`;
    });
    console.log(data);
  }

  static printProprtyConfig(entityData, searchData) {
    let data = '';
    data += 'propertyConfig,code,name,fieldLabel,insertable,updatable,required,weight,xtype,section,sectionWeight,searchable,entity\n';
    _.forIn(entityData, (value, key) => {
      for (let i = 0; i < value.sections.length; i++) {
        let section = value.sections[i];
        let sectionWeight = i * 10;
        for (let j = 0; j < section.items.length; j++) {
          let item = section.items[j];
          let itemWeight = j * 10;
          let searchable = false;
          if (searchData[key] && _.some(searchData[key].filter, {name: item.name})) {
            searchable = true;
          }
          data += `,${key}-${item.name},${item.name.replace('entity-', '')},${item.fieldLabel},${!item.readOnly},${!item.readOnly},${item.required},${itemWeight},${item.xtype},${section.title},${sectionWeight},${searchable},${key}\n`
        }
      }
    });
    console.log(data);
  }
}