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

describe('getParams', () => {
  it('returns undefined when no params object', () => {
    expect(Metadata.getParams(target, 'key1')).toBeUndefined();
  });

  it('returns undefined when key not in params object', () => {
    target.constructor[PARAMS_KEY] = {};
    expect(Metadata.getParams(target, 'key1')).toBeUndefined();
  });

  it('returns the value when defined', () => {
    target.constructor[PARAMS_KEY] = { key1: [] };
    expect(Metadata.getParams(target, 'key1')).toEqual([]);
  });
});

describe('setParams', () => {
  it('sets value when no params object', () => {
    Metadata.setParams(target, 'key1', 0, RequestParam.JsonBody);
    expect(target.constructor[PARAMS_KEY].key1).toEqual([RequestParam.JsonBody]);
  });

  it('sets value when key not in params object', () => {
    target.constructor[PARAMS_KEY] = {};
    Metadata.setParams(target, 'key1', 0, RequestParam.JsonBody);
    expect(target.constructor[PARAMS_KEY].key1).toEqual([RequestParam.JsonBody]);
  });

  it('sets the value when key defined', () => {
    target.constructor[PARAMS_KEY] = { key1: [333, 444] };
    Metadata.setParams(target, 'key1', 1, RequestParam.JsonBody);
    expect(target.constructor[PARAMS_KEY].key1).toEqual([333, RequestParam.JsonBody]);
  });
});
