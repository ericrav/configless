/* eslint-disable no-shadow */
import { Lambda } from 'aws-sdk';

import { Handler, Body } from '../../src';
import Metadata from '../../src/decorators/metadata';

jest.mock('aws-sdk');

const spy = jest.fn();

class MockClass {
  @Handler()
  public mockMethod(event: any) {
    spy(event);
  }
}

describe('adding config metadata to the class', () => {
  it('adds an empty object when nothing passed', () => {
    expect(Metadata.getFunctions(MockClass)).toEqual([
      ['mockMethod', {}],
    ]);
  });

  it('adds any config object passed', () => {
    class MockClass {
      @Handler({ env: 42, foo: 'bar' })
      public mockMethod() {}
    }

    expect(Metadata.getFunctions(MockClass)).toEqual([
      ['mockMethod', { env: 42, foo: 'bar' }],
    ]);
  });

  it('adds configs for multiple handlers', () => {
    class MockClass {
      @Handler()
      public mock1() {}

      @Handler({ danny: 'devito' })
      public mock2() {}

      @Handler({ environment: { sound: 'and I sound like this' } })
      public theArm() {}
    }

    expect(Metadata.getFunctions(MockClass)).toEqual([
      ['mock1', {}],
      ['mock2', { danny: 'devito' }],
      ['theArm', { environment: { sound: 'and I sound like this' } }],
    ]);
  });
});

describe('invoke metadata assignment', () => {
  it('add a metadata key that invokes the method', () => {
    const mock = new MockClass();
    expect(mock['__invoke_mockMethod']).toBeDefined();
    mock['__invoke_mockMethod']();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('class instances and this', () => {
  class ThisMockClass {
    private foo = 42;

    private greeting: string;

    public constructor() {
      this.greeting = 'Hello World';
    }

    private hello() {
      return this.greeting;
    }

    @Handler()
    public async mockMethod() {
      return {
        foo: this.foo,
        greeting: this.hello(),
      };
    }
  }

  it('can access all instance properties', async () => {
    const result = await new ThisMockClass()['__invoke_mockMethod']();
    expect(result).toEqual({
      foo: 42,
      greeting: 'Hello World',
    });
  });
});

describe('transforming the function arguments', () => {
  class MockWithBody {
    @Handler()
    public async mockMethod(@Body() body) {
      return body;
    }
  }

  it('passes the JSON body as an object argument', async () => {
    const result = await new MockWithBody().mockMethod({ body: JSON.stringify({ foo: 'bar' }) });
    expect(result).toEqual({ foo: 'bar' });
  });

  it('passes {} if no body in event', async () => {
    const result = await new MockWithBody().mockMethod({});
    expect(result).toEqual({});
  });

  it('passes the body argument in any position', async () => {
    class Mock {
      @Handler()
      public async mockMethod(event, context, @Body() body) {
        return [event, context, body];
      }
    }
    const event = { foo: 1, body: JSON.stringify({ bar: 'baz' }) };
    const result = await (new Mock().mockMethod as any)(event, {});
    expect(result).toEqual([event, {}, { bar: 'baz' }]);

    class Mock2 {
      @Handler()
      public async mockMethod(event, @Body() body, context) {
        return [event, body, context];
      }
    }
    const result2 = await (new Mock2().mockMethod as any)(event, {});
    expect(result2).toEqual([event, { bar: 'baz' }, {}]);
  });
});


describe('invoking the AWS Lambda function', () => {
  const invoke = jest.fn();
  let instance;

  beforeEach(() => {
    process.env.SLS_DECORATORS_FUNC_PREFIX = 'service-test';

    (Lambda as unknown as jest.SpyInstance).mockImplementation(() => ({
      invoke,
    }));

    process.env.NODE_ENV = 'production';
    process.env.IS_LOCAL = undefined;

    class AWSMockClass {
      @Handler()
      public mockMethod(event: any) {}
    }

    instance = new AWSMockClass();
  });

  it('calls lambda.invoke with the right properties', () => {
    instance.mockMethod({ foo: 'bar' });
    expect(Lambda).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0][0]).toEqual({
      FunctionName: 'service-test-mockMethod',
      InvocationType: 'Event',
      Payload: JSON.stringify({ foo: 'bar' }),
    });
  });

  it('calls lambda.invoke with a custom function name', () => {
    class MockClass {
      @Handler({ name: 'someLambda' })
      public mockMethod() {}
    }

    new MockClass().mockMethod();

    expect(invoke.mock.calls[0][0]).toEqual({
      FunctionName: 'someLambda',
      InvocationType: 'Event',
      Payload: undefined,
    });
  });

  it('resolves the promise when callback has no error', () => {
    const promise = instance.mockMethod({ foo: 'bar' });
    const callback = invoke.mock.calls[0][1];
    callback(undefined, 'data');
    expect(promise).resolves.toEqual('data');
  });

  it('rejects the promise when callback has an error', () => {
    const promise = instance.mockMethod({ foo: 'bar' });
    const callback = invoke.mock.calls[0][1];
    callback('err');
    expect(promise).rejects.toEqual('err');
  });
});
