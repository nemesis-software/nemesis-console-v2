import FilterBuild from '../src/app/services/filter-builder';

describe('test filter build for null and not null restrictions', () => {
  test('should allowed empty value for "is null" filter', () => {
    let filterFields = [{field: 'some null field', restriction: 'Null', value: null}];
    expect(FilterBuild.buildFilter(filterFields)).toMatchSnapshot();
  });

  test('should allowed empty value for "is not null" filter', () => {
    let filterFields = [{field: 'some not null field', restriction: 'NotNull', value: null}];
    expect(FilterBuild.buildFilter(filterFields)).toMatchSnapshot();
  });

  test('should result with empty value and non empty for "is null" filter to be the same', () => {
    let fieldWithNullValue = {field: 'some null field', restriction: 'Null', value: null};
    let fieldWithValue = {field: 'some null field', restriction: 'Null', value: 'test'};

    expect(FilterBuild.buildFilter([fieldWithNullValue])).toBe(FilterBuild.buildFilter([fieldWithValue]));
  });

  test('should result with empty value and non empty for "is not null" filter to be the same', () => {
    let fieldWithNullValue = {field: 'some not null field', restriction: 'NotNull', value: null};
    let fieldWithValue = {field: 'some not null field', restriction: 'NotNull', value: 'test'};

    expect(FilterBuild.buildFilter([fieldWithNullValue])).toBe(FilterBuild.buildFilter([fieldWithValue]));
  });
});