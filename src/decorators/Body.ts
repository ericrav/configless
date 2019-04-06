import { RequestParam } from './config';
import Metadata from './metadata';

export function Body(): ParameterDecorator {
  return (target: Object, key: string, index: number) => {
    Metadata.setParams(target, key, index, RequestParam.JsonBody);
  };
}
