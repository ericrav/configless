import { Env } from '../../src';
import Metadata from '../../src/decorators/metadata';

class Mock {
  @Env() private foobar: number;

  @Env('SOME_ENV') private test: string;
}

it('adds environment metadata to the class', () => {
  expect(Metadata.getEnv(Mock)).toEqual([
    { key: 'foobar', envName: 'foobar' },
    { key: 'test', envName: 'SOME_ENV' },
  ]);
});
