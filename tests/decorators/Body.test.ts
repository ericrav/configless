import { Body } from '../../src';
import Metadata from '../../src/decorators/metadata';
import { RequestParam } from '../../src/decorators/config';

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
