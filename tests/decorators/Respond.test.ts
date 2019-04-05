import { Respond } from '../../src';

class Mock {
  @Respond(201)
  public async post() {
    return {
      foo: 'bar',
    };
  }

  @Respond(200, { Accept: 'json' })
  public async get() {
    return {
      foo: 'bar',
    };
  }
}

it('transforms the method response', async () => {
  expect(await new Mock().post()).toEqual({
    statusCode: 201,
    body: JSON.stringify({ foo: 'bar' }),
  });

  expect(await new Mock().get()).toEqual({
    statusCode: 200,
    headers: { Accept: 'json' },
    body: JSON.stringify({ foo: 'bar' }),
  });
});
