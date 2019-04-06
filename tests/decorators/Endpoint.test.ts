import { Endpoint, Handler } from '../../src';
import Metadata from '../../src/decorators/metadata';

class Mock {
  @Endpoint('GET', '/test')
  @Handler()
  public get() {}

  @Endpoint('POST', '/test', { headers: { Accept: 'foobar' } })
  @Handler()
  public post() {}

  @Endpoint('PUT', '/foobar')
  @Endpoint('POST', '/foobar')
  @Handler()
  public foobar() {}
}

it('adds http events to the config metadata', () => {
  expect(Metadata.getFunctions(Mock)).toEqual([
    [
      'get',
      { events: [{ http: { method: 'GET', path: '/test' } }] },
    ],
    [
      'post',
      { events: [{ http: { method: 'POST', path: '/test', headers: { Accept: 'foobar' } } }] },
    ],
    [
      'foobar',
      {
        events: [
          { http: { method: 'POST', path: '/foobar' } },
          { http: { method: 'PUT', path: '/foobar' } },
        ],
      },
    ],
  ]);
});

it('throws without @Handler decorator', () => {
  function declareClass() {
    class MockClass2 {
      @Endpoint('GET', 'foo')
      public test() {}
    }
    return MockClass2;
  }

  expect(declareClass).toThrow(/Missing @Handler decorator for test/);
});
