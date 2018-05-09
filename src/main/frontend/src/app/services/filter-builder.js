import {nemesisFieldTypes, searchRestrictionTypes} from '../types/nemesis-types';

export default class FilterBuilder {
  static buildFilter(appliedFilters, filterSearchType) {
    let filterSearchTypeActual = filterSearchType ? filterSearchType : 'and';
    let restrictionMap = this.getRestrictionMap();
    let result = [];
    let filterItemIndex = 0;
    appliedFilters.forEach(item => {
      if (!item.restriction) {
        return;
      }
      let restrictionData = restrictionMap[item.restriction];
      if (restrictionData.isValueRequired && this.isEmpty(item['value'])) {
        return;
      }

      result.push(restrictionData.getFilterString(item, filterItemIndex++));
    });

    return result.join(` ${filterSearchTypeActual} `);
  }

  static getRestrictionMap() {
    let result = {};

    result[searchRestrictionTypes.startingWith] = {
      getFilterString: (item) => {
        if (item.nestedFilters && _.some(item.nestedFilters, {xtype: nemesisFieldTypes.nemesisCollectionField})) {
          return this.getCustomStringForNestedCollection(item, 'startswith', 'eq true');
        } else {
          return `startswith(${this.getFullFieldCode(item)}, ${item.value}) eq true`
        }
      },
      isValueRequired: true
    };

    result[searchRestrictionTypes.endingWith] = {
      getFilterString: (item) => {
        if (item.nestedFilters && _.some(item.nestedFilters, {xtype: nemesisFieldTypes.nemesisCollectionField})) {
          return this.getCustomStringForNestedCollection(item, 'endswith', 'eq true');
        } else {
          return `endswith(${this.getFullFieldCode(item)}, ${item.value}) eq true`
        }
      },
      isValueRequired: true
    };

    result[searchRestrictionTypes.contains] = {
      getFilterString: (item) => {
        if (item.nestedFilters && _.some(item.nestedFilters, {xtype: nemesisFieldTypes.nemesisCollectionField})) {
          return this.getCustomStringForNestedCollection(item, 'indexof', 'ge 0');
        } else {
          return `indexof(${this.getFullFieldCode(item)}, ${item.value}) ge 0`
        }
      },
      isValueRequired: true
    };

    result[searchRestrictionTypes.after] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)} gt ${item.value}Z${this.getClosedBrackets(item)}`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.before] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)} lt ${item.value}Z${this.getClosedBrackets(item)}`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.between] = {
      getFilterString: (item) => {
        if (item.value.from && item.value.to) {
          return `(${this.getFullFieldCode(item)} gt ${item.value.from}Z and ${this.getFullFieldCode(item)} lt ${item.value.to}Z)${this.getClosedBrackets(item)}`
        } else if (item.value.from) {
          return `${this.getFullFieldCode(item)} gt ${item.value.from}Z${this.getClosedBrackets(item)}`
        } else {
          return `${this.getFullFieldCode(item)} lt ${item.value.to}Z${this.getClosedBrackets(item)}`
        }
      },
      isValueRequired: true
    };

    result[searchRestrictionTypes.greaterThan] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)} ge ${item.value}M${this.getClosedBrackets(item)}`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.lessThan] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)} le ${item.value}M${this.getClosedBrackets(item)}`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.equals] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)} eq ${item.value}${this.getClosedBrackets(item)}`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.notEquals] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)} ne ${item.value}${this.getClosedBrackets(item)}`,
      isValueRequired: true
    };

    result[searchRestrictionTypes.notNull] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)} ne null${this.getClosedBrackets(item)}`,
      isValueRequired: false
    };

    result[searchRestrictionTypes.isNull] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)} eq null${this.getClosedBrackets(item)}`,
      isValueRequired: false
    };

    result[searchRestrictionTypes.any] = {
      getFilterString: (item, filterItemIndex) => `${this.getFullFieldCode(item)}/any(${item.field + filterItemIndex}:${item.field + filterItemIndex}/id eq ${item.value})${this.getClosedBrackets(item)}`,
      isValueRequired: true
    };

    // result[searchRestrictionTypes.all] = {
    //   getFilterString: (item, filterItemIndex) => `${this.getFullFieldCode(item)}/all(${item.field + filterItemIndex}:${item.field + filterItemIndex}/id eq ${item.value})${this.getClosedBrackets(item)}`,
    //   isValueRequired: true
    // };

    result[searchRestrictionTypes.count] = {
      getFilterString: (item) => `${this.getFullFieldCode(item)}/$count ${this.parseCountSecondRestriction(item.secondRestriction)} ${item.value})${this.getClosedBrackets(item)}`,
      isValueRequired: true
    };

    return result;
  }

  static parseCountSecondRestriction(restriction) {
    switch (restriction) {
      case searchRestrictionTypes.equals: return 'eq';
      case searchRestrictionTypes.lessThan: return 'lt';
      case searchRestrictionTypes.greaterThan: return 'gt';
    }
  }

  static getFullFieldCode(item) {
    let increminator = 0;
    let prefix = 'nested';
    if (!item.nestedFilters) {
      return item.field;
    }

    let result = '';
    item.nestedFilters.forEach(filter => {
      if (filter.xtype === nemesisFieldTypes.nemesisCollectionField) {
        result += `${filter.name}/any(${filter.name + increminator + prefix}:${filter.name + increminator + prefix}/`;
        increminator++;
      } else {
        result += `${filter.name}/`
      }
    });

    return `${result}${item.field}`;
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

  static getClosedBrackets(item) {
    if (!item.nestedFilters) {
      return '';
    }

    let collectionCount = 0;

    item.nestedFilters.forEach(item => {
      if (item.xtype === nemesisFieldTypes.nemesisCollectionField) {
        collectionCount++
      }
    });

    return Array(collectionCount + 1).join(')');
  }

  static getCustomStringForNestedCollection(item, method, equalityParam) {
    let increminator = 0;
    let prefix = 'nested';
    let indexOfLastCollectionFilter = _.findLastIndex(item.nestedFilters, {xtype: nemesisFieldTypes.nemesisCollectionField});
    let result = '';
    for (let i = 0; i < item.nestedFilters.length; i++) {
      let currentFilter = item.nestedFilters[i];
      if (indexOfLastCollectionFilter === i) {
        result += `${currentFilter.name}/any(${currentFilter.name + increminator + prefix}:${method}(${currentFilter.name + increminator + prefix}/`;
        increminator++;
      } else {
        if (currentFilter.xtype === nemesisFieldTypes.nemesisCollectionField) {
          result += `${currentFilter.name}/any(${currentFilter.name + increminator + prefix}:${currentFilter.name + increminator + prefix}/`;
          increminator++;
        } else {
          result += `${currentFilter.name}/`
        }
      }
    }

    result += `${item.field}, ${item.value}) ${equalityParam}${this.getClosedBrackets(item)}`;

    return result;
  }
}