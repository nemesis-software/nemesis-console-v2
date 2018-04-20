import { nemesisFieldTypes} from '../types/nemesis-types';

export default class CssClassHelper {
  static getStyleClassSectionItem(itemType) {
    let className = '';
    switch (itemType) {
      case nemesisFieldTypes.nemesisPasswordField:
      case nemesisFieldTypes.nemesisDecimalField:
      case nemesisFieldTypes.nemesisDateField:
      case nemesisFieldTypes.nemesisDateTimeField:
      case nemesisFieldTypes.nemesisIntegerField:
      case nemesisFieldTypes.nemesisBooleanField:
      case nemesisFieldTypes.nemesisEnumField:
      case nemesisFieldTypes.nemesisTextField: className = ' simple-item-container'; break;
      case nemesisFieldTypes.nemesisTextarea:
      case nemesisFieldTypes.nemesisMapField:
      case nemesisFieldTypes.nemesisEntityField:
      case nemesisFieldTypes.nemesisColorpickerField:
      case nemesisFieldTypes.nemesisHtmlEditor: className = ' single-item-container-with-icon'; break;
      case nemesisFieldTypes.nemesisLocalizedTextField:
      case nemesisFieldTypes.nemesisLocalizedRichtextField: className = ' item-container-with-icon'; break;
      case nemesisFieldTypes.nemesisCollectionField:
      case nemesisFieldTypes.nemesisProjectionCollection:
      case nemesisFieldTypes.nemesisCategoriesCollection:
      case nemesisFieldTypes.nemesisSimpleCollectionField: className = ' full-screen-item-container'; break;
      case nemesisFieldTypes.nemesisMediaField: className = ''; break;
      default: className =  '';
    }

    return className;
  }
}