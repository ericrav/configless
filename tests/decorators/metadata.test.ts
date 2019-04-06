/* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
import Metadata from '../../src/decorators/metadata';
import { RequestParam } from '../../src/decorators/config';

const FUNCTIONS_KEY = '__SLSTS_FUNCTIONS';
const ENV_KEY = '__SLSTS_ENV_PROPERTIES';
const PARAMS_KEY = '__SLSTS_PARAMS';

let target: Object;

beforeEach(() => {
  target = { constructor: {} } as Object;
});

describe('getFunction', () => {
  it('returns undefined when no params object', () => {
    expect(Metadata.getFunction(target.constructor, 'key1')).toBeUndefined();
  });

  it('returns the value when defined', () => {
    target.constructor[FUNCTIONS_KEY] = {
      key1: {},
      key2: { foo: 'a' },
      key3: { foo: 'b' },
    };

    expect(Metadata.getFunction(target.constructor, 'key3')).toEqual({ foo: 'b' });
  });
});

describe('getFunctions', () => {
  it('returns undefined when no params object', () => {
    expect(Metadata.getFunctions(target.constructor)).toBeUndefined();
  });

  it('returns the value when defined', () => {
    target.constructor[FUNCTIONS_KEY] = {
      key1: {},
      key2: { foo: 'a' },
      key3: { foo: 'b' },
    };

    expect(Metadata.getFunctions(target.constructor)).toEqual([
      ['key1', {}],
      ['key2', { foo: 'a' }],
      ['key3', { foo: 'b' }],
    ]);
  });
});

describe('setFunctions', () => {
  it('sets value when no params object', () => {
    Metadata.setFunctions(target.constructor, 'key1', { foo: 42 });
    expect(target.constructor[FUNCTIONS_KEY].key1).toEqual({ foo: 42 });
  });

  it('sets value when key not in params object', () => {
    target.constructor[FUNCTIONS_KEY] = {};
    Metadata.setFunctions(target.constructor, 'key1', { foo: 42 });
    expect(target.constructor[FUNCTIONS_KEY].key1).toEqual({ foo: 42 });
  });

  it('sets the value when key defined', () => {
    target.constructor[FUNCTIONS_KEY] = { key1: {}, key2: { bar: 'baz' } };
    Metadata.setFunctions(target.constructor, 'key1', { foo: 42 });
    expect(target.constructor[FUNCTIONS_KEY].key1).toEqual({ foo: 42 });
    expect(target.constructor[FUNCTIONS_KEY].key2).toEqual({ bar: 'baz' });
  });
});

describe('getEnv', () => {
  it('returns undefined when no env metadata', () => {
    expect(Metadata.getEnv(target.constructor)).toBeUndefined();
  });

  it('returns the value when defined', () => {
    target.constructor[ENV_KEY] = [{ key: 'foo', envName: 'bar' }];

    expect(Metadata.getEnv(target.constructor)).toEqual([
      { key: 'foo', envName: 'bar' },
    ]);
  });
});

describe('setEnv', () => {
  it('sets the value when no env metadata array yet', () => {
    Metadata.setEnv(target.constructor, { key: 'xyz', envName: 'xyz' });
    expect(target.constructor[ENV_KEY]).toEqual([
      { key: 'xyz', envName: 'xyz' },
    ]);
  });

  it('add the value to the end of the array when defined', () => {
    const prop1 = { key: '1', envName: '1' };
    const prop2 = { key: '2', envName: '2' };
    const prop3 = { key: '3', envName: '3' };
    target.constructor[ENV_KEY] = [];
    Metadata.setEnv(target.constructor, prop1);
    expect(Metadata.getEnv(target.constructor)).toEqual([
      prop1,
    ]);
    Metadata.setEnv(target.constructor, prop2);
    expect(Metadata.getEnv(target.constructor)).toEqual([
      prop1,
      prop2,
    ]);
    Metadata.setEnv(target.constructor, prop3);
    expect(Metadata.getEnv(target.constructor)).toEqual([
      prop1,
      prop2,
      prop3,
    ]);
  });
});

describe('getParams', () => {
  it('returns undefined when no params object', () => {
    expect(Metadata.getParams(target.constructor, 'key1')).toBeUndefined();
  });

  it('returns undefined when key not in params object', () => {
    target.constructor[PARAMS_KEY] = {};
    expect(Metadata.getParams(target.constructor, 'key1')).toBeUndefined();
  });

  it('returns the value when defined', () => {
    target.constructor[PARAMS_KEY] = { key1: [] };
    expect(Metadata.getParams(target.constructor, 'key1')).toEqual([]);
  });
});

describe('setParams', () => {
  it('sets value when no params object', () => {
    Metadata.setParams(target.constructor, 'key1', 0, RequestParam.JsonBody);
    expect(target.constructor[PARAMS_KEY].key1).toEqual([RequestParam.JsonBody]);
  });

  it('sets value when key not in params object', () => {
    target.constructor[PARAMS_KEY] = {};
    Metadata.setParams(target.constructor, 'key1', 0, RequestParam.JsonBody);
    expect(target.constructor[PARAMS_KEY].key1).toEqual([RequestParam.JsonBody]);
  });

  it('sets the value when key defined', () => {
    target.constructor[PARAMS_KEY] = { key1: [333, 444] };
    Metadata.setParams(target.constructor, 'key1', 1, RequestParam.JsonBody);
    expect(target.constructor[PARAMS_KEY].key1).toEqual([333, RequestParam.JsonBody]);
  });
});
