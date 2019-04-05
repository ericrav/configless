import { Env } from '../../src';
import { ENV_METADATA } from '../../src/decorators/config';

class Mock {
  @Env() private foobar: number;

  @Env('SOME_ENV') private test: string;
}

it('adds environment metadata to the class', () => {
  expect(Mock[ENV_METADATA]).toEqual([
    { key: 'foobar', envName: 'foobar' },
    { key: 'test', envName: 'SOME_ENV' },
  ]);
});
