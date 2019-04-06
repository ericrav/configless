import {
  addServices, Service, Handler, Endpoint,
} from '../src';

@Service()
class Mock1 {
  @Handler()
  public async foo() {
    return 'foo';
  }
}

@Service({ environment: { x: 'abc' } })
class Mock2 {
  @Handler()
  public async bar() {
    return 'bar';
  }

  @Endpoint('GET', '/test')
  @Handler()
  public async baz() {
    return 'baz';
  }
}

it('returns the compiled function configs', () => {
  expect(addServices({}, [Mock1, Mock2])).toEqual({
    foo: { handler: 'functions.service0_foo' },
    bar: { environment: { x: 'abc' }, handler: 'functions.service1_bar' },
    baz: {
      environment: { x: 'abc' },
      events: [{ http: { method: 'GET', path: '/test' } }],
      handler: 'functions.service1_baz',
    },
  });
});

it('adds the functions to the exports object', async () => {
  const exports = {};
  addServices(exports, [Mock1, Mock2]);
  expect(await exports['service0_foo']()).toEqual('foo');
  expect(await exports['service1_bar']()).toEqual('bar');
  expect(await exports['service1_baz']()).toEqual('baz');
});

it('skips compiling if exports are already defined on module', () => {
  const exports = {};
  addServices(exports, [Mock1, Mock2]);
  module.exports = exports;

  const exports2 = {};
  expect(addServices(exports2, [Mock1, Mock2])).toBeUndefined();
  expect(exports2).toEqual(exports);
});
