import { Body } from '../../src';
import { RequestParam } from '../../src/decorators/config';
import Metadata from '../../src/decorators/metadata';

jest.spyOn(Metadata, 'setParams');

it('should set the params metadata', () => {
  class Mock {
    public async method(@Body() body: object) {
      return body;
    }
  }

  expect(Metadata.setParams)
    .toBeCalledWith(Mock.prototype, 'method', 0, RequestParam.JsonBody);
});
