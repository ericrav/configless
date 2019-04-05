import { Service } from '../../src';
import { FUNCTIONS_METADATA, ENV_METADATA } from '../../src/decorators/config';

it('preserves static properties', () => {
  @Service()
  class StaticMock {
    public static [ENV_METADATA] = true;

    public static static1 = 'foobar';

    public static static2 = 42;
  }

  expect(StaticMock.static1).toEqual('foobar');
  expect(StaticMock.static2).toEqual(42);
});

it('preserves instance properties', () => {
  @Service()
  class InstanceMock {
    public static [ENV_METADATA] = true;

    public prop1 = 'foobar';

    public prop2 = 42;
  }

  const mock = new InstanceMock();
  expect(mock.prop1).toEqual('foobar');
  expect(mock.prop2).toEqual(42);
});

it('deepmerges the function configs with config passed', () => {
  @Service({ environment: { foo: 'bar' } })
  class Mock {
    public static [FUNCTIONS_METADATA] = {
      function1: {},
      function2: { environment: { bar: 'baz' } },
      function3: { foo: 42 },
    };
  }

  expect(Mock[FUNCTIONS_METADATA]).toEqual({
    function1: { environment: { foo: 'bar' } },
    function2: { environment: { foo: 'bar', bar: 'baz' } },
    function3: { environment: { foo: 'bar' }, foo: 42 },
  });
});

describe('environment properties', () => {
  beforeAll(() => {
    process.env.fruit = 'apple';
    process.env.vegetable = 'asparagus';
    process.env.drink = 'juice';
  });

  it('sets instance properties from process.env', () => {
    @Service()
    class Mock {
      public static [ENV_METADATA] = [
        { key: 'prop1', envName: 'fruit' },
        { key: 'prop2', envName: 'vegetable' },
        { key: 'prop3', envName: 'drink' },
      ];
    }

    const mock = new Mock();
    expect(mock['prop1']).toEqual('apple');
    expect(mock['prop2']).toEqual('asparagus');
    expect(mock['prop3']).toEqual('juice');
  });
});
