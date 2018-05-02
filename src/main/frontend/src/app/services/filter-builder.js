import { searchRestrictionTypes } from '../types/nemesis-types';

export default class FilterBuilder {
  static buildFilter(appliedFilters, filterSearchType) {
    let filterSearchTypeActual = filterSearchType ? filterSearchType : 'and';
    let restrictionMap = this.getRestrictionMap();
    let result = [];
    appliedFilters.forEach(item => {
      if (!item.restriction) {
        return;
      }
      let restrictionData = restrictionMap[item.restriction];
      if (restrictionData.isValueRequired && this.isEmpty(item['value'])) {
        return;
      }

      result.push(restrictionData.getFilterString(item));
    });

    return result.join(` ${filterSearchTypeActual} `);
  }

  static getRestrictionMap() {
    let result = {};

    result[searchRestrictionTypes.startingWith] = {
      getFilterString: (item) => `startswith(${item.field}, ${item.value}) eq true`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.endingWith] = {
      getFilterString: (item) => `endswith(${item.field}, ${item.value}) eq true`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.contains] = {
      getFilterString: (item) => `(indexof(${item.field}, ${item.value}) ge 0)`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.after] = {
      getFilterString: (item) => `${item.field} gt datetime'${item.value}'`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.before] = {
      getFilterString: (item) => `${item.field} lt datetime'${item.value}'`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.between] = {
      getFilterString: (item) => {
        if (item.value.from && item.value.to) {
          return `(${item.field} gt datetime'${item.value.from}' and ${item.field} lt datetime'${item.value.to}')`
        } else if (item.value.from) {
          return `${item.field} gt datetime'${item.value.from}'`
        } else {
          return `${item.field} lt datetime'${item.value.to}'`
        }
      },
      isValueRequired: true
    };

    result[searchRestrictionTypes.greaterThan] = {
      getFilterString: (item) => `${item.field} ge ${item.value}M`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.lessThan] = {
      getFilterString: (item) => `${item.field} le ${item.value}M`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.equals] = {
      getFilterString: (item) => `${item.field} eq ${item.value}`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.notNull] = {
      getFilterString: (item) => `${item.field} ne null`,
      isValueRequired: false
    };

    result[searchRestrictionTypes.isNull] = {
      getFilterString: (item) => `${item.field} eq null`,
      isValueRequired: false
    };

    result[searchRestrictionTypes.any] = {
      getFilterString: (item) => `${item.field}/any(${item.field}:${item.field}/id eq ${item.value})`,
      isValueRequired: true
    };

    return result;
  }

  static isEmpty(value) {
    if (value === undefined) {
      return true;
    }

    if (value === null) {
      return true;
    }

    if (typeof value === 'string' && value.trim().length === 0) {
      return true;
    }

    return false;
  }

}