import React from 'react';
import NemesisEntityField from '../../src/app/components/field-components/nemesis-entity-field/nemesis-entity-field';
import { shallow, mount } from 'enzyme';
import ApiCall from '../../src/app/services/api-call';


describe('test nemesis entity field', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<NemesisEntityField label="test"/>);
  });

  test('Assert successfully rendering', () => {
    expect(wrapper.length).toEqual(1);
  });
});

describe('test nemesis entity field search url', () => {

  test('url for catalog version should search for by code and catalog code', () => {
    let wrapper = shallow(<NemesisEntityField label="test" entityId="catalog_version"/>);
    expect(wrapper.instance().getSearchUrl()).toMatchSnapshot();
  });

  test('url for different from catalog version should search only by code', () => {
    let wrapper = shallow(<NemesisEntityField label="test" entityId="testID"/>);
    expect(wrapper.instance().getSearchUrl()).toMatchSnapshot();
  });
});

describe('test nemesis entity field value change', () => {
  test('on change value dirty state should be checked and outer function onValueChange should be called', () => {
    const onValueChange = jest.fn();
    let newValue = 'test';
    let wrapper = shallow(<NemesisEntityField onValueChange={onValueChange} label="test" entityId="catalog_version"/>);
    expect(wrapper.state('isDirty')).toBeFalsy();
    wrapper.instance().onValueChange(newValue);
    expect(wrapper.state('isDirty')).toBeTruthy();
    expect(wrapper.state('value')).toBe(newValue);
    expect(onValueChange.mock.calls.length).toBe(1);
    expect(onValueChange.mock.calls[0][0]).toBe(newValue);
  });
});

describe('test nemesis entity field navigation icon', () => {
  ApiCall.get = () => {
    return Promise.resolve({data: {_embedded: []}});
  };

  const onEntityItemClick = jest.fn();

  test('on entity navigation icon click external onEntityItemClick function should be call', () => {
    let defaultElementValue = {
      _links: {
        self: {
          href: 'test.link'
        }
      }
    };

    let wrapper = mount(<NemesisEntityField onEntityItemClick={onEntityItemClick} type="EDIT" label="test" value={defaultElementValue} entityId="catalog_version"/>);
    let navigationIcon = wrapper.find('.entity-navigation-icon');
    expect(navigationIcon).toHaveLength(1);
    navigationIcon.simulate('click');
    expect(onEntityItemClick.mock.calls.length).toBe(1);
  });

  test('on empty value entity navigation icon should have class "disabled" and on click external onEntityItemClick function should not be call', () => {
    onEntityItemClick.mockReset();
    let wrapper = mount(<NemesisEntityField onEntityItemClick={onEntityItemClick} type="EDIT" label="test" value={null} entityId="catalog_version"/>);
    let navigationIcon = wrapper.find('.entity-navigation-icon');
    expect(navigationIcon.hasClass('disabled')).toBeTruthy();
    navigationIcon.simulate('click');
    expect(onEntityItemClick.mock.calls.length).toBe(0);
  });
});
