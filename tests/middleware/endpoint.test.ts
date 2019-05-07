import { useEndpoint } from '../../src/middleware/endpoint';

it('returns an events array with an http object', () => {
  expect(useEndpoint('GET', '/test')).toEqual({
    events: [{ http: { method: 'GET', path: '/test' } }],
  });

  expect(useEndpoint('POST', '/test', { headers: { accept: 'json' } })).toEqual({
    events: [{ http: { method: 'POST', path: '/test', headers: { accept: 'json' } } }],
  });
});
