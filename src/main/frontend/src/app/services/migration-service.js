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

  static printProprtyConfig(entityData) {
    let data = '';
    data += 'propertyConfig,name,fieldLabel,readOnly,required,weight,xtype,section,sectionWeight,entity\n';
    _.forIn(entityData, (value, key) => {
      for (let i = 0; i < value.sections.length; i++) {
        let section = value.sections[i];
        let sectionWeight = 100 - i;
        for (let j = 0; j < section.items.length; j++) {
          let item = section.items[j];
          let itemWeight = 100 - j;
          data += `,${item.name},${item.fieldLabel},${item.readOnly},${item.required},${itemWeight},${item.xtype},${section.title},${sectionWeight},${key}\n`
        }
      }
    });
    console.log(data);
  }
}