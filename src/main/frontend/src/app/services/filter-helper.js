import React from 'react';

import { searchRestrictionTypes} from '../types/nemesis-types';

import Translate from 'react-translate-component';


export default class FilterHelper {
  static getFilterFieldTextRepresentation(name, restrictionValue, value, secondRestrictionValue) {
    if (!restrictionValue || ((restrictionValue !== searchRestrictionTypes.isNull && restrictionValue !== searchRestrictionTypes.notNull) && !value)) {
      return null;
    }

    if (restrictionValue === searchRestrictionTypes.isNull || restrictionValue === searchRestrictionTypes.notNull) {
      return (
        <span key={name}><Translate component="b" content={'main.' + name} fallback={name}/> <Translate component="i" content={'main.' + restrictionValue} fallback={restrictionValue}/>; </span>
      );
    }

    if (restrictionValue === searchRestrictionTypes.between) {
      return (
        <span key={name}><Translate component="b" content={'main.' + name} fallback={name}/> <Translate component="i" content={'main.' + restrictionValue} fallback={restrictionValue}/> <b>{value.from || '\'\''} and {value.to || '\'\''}</b>; </span>
      );
    }

    if (restrictionValue === searchRestrictionTypes.count) {
      return (
        <span key={name}><Translate component="b" content={'main.' + name} fallback={name}/> <Translate component="i" content={'main.' + restrictionValue} fallback={restrictionValue}/> <Translate component="i" content={'main.' + secondRestrictionValue} fallback={secondRestrictionValue}/> <b>{value}</b>; </span>
      );
    }

    return (
      <span key={name}><Translate component="b" content={'main.' + name} fallback={name}/> <Translate component="i" content={'main.' + restrictionValue} fallback={restrictionValue}/> <b>{value}</b>; </span>
    );
  }
}