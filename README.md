# Configless with Serverless
[![npm version](https://badge.fury.io/js/configless.svg)](https://badge.fury.io/js/configless)

Configless is a Serverless plugin and library of TypeScript decorators that set the config for Lambda functions in `serverless.yml`
and provide middleware for common tasks.

## Install

```
yarn add configless
```

## Example

```ts
@Service({
  environment: { tableName: 'users-table' },
})
export class UserService {
  @Env() tableName: string;

  @Endpoint('GET', '/users')
  @Handler()
  @Respond(200)
  async getUsers() {
    return getFromTable(this.tableName);
  }

  @Endpoint('POST', '/users')
  @Handler()
  @Respond(201)
  async createUser(@Body() userData: object) {
    const newUser = addToTable(this.tableName, userData);
    return newUser;
  }
}
```

Then add a `functions.ts` file:

```ts
export default addServices(exports, [
  UserService,
  OtherService,
]);
```

Add the plugin in `serverless.yml`, no `functions` config needed:

```yaml
plugins:
  - configless/plugin
```

The above will produce the following configuration:
```yaml
functions:
  getUsers:
    environment:
      tableName: users-table
    events:
    - http:
        method: GET
        path: "/users"
    handler: functions.service0_getUsers
  createUser:
    environment:
      tableName: users-table
    events:
    - http:
        method: POST
        path: "/users"
    handler: functions.service0_createUser
```

# Available Decorators

## Handler

```ts
@Handler({ ...functionConfig })
async someLambda(event, context) {}
```

`Handler` creates the config for the method and includes any passed config object.
The name of the method is the name of the Serverless function.

`Handler` also wraps methods in an `AWS.Lambda#invoke` call.

```ts
@Handler()
async sendNotification(event) {}

@Handler()
async sendMessage(event) {
  // in production, instead of calling the actual method,
  // it will invoke the appropriate AWS Lambda function and pass the event data
  new NotificationService().sendNotification(data);
}
```

## Service

```ts
@Serivce({ ...functionConfig })
class MyService {

}
```

`Service` will copy a passed config object to each of its Handler methods.
The configs are deep merged together, with precedence given to the `@Handler` method's config.

## Env

```ts
@Service()
class MyService {
  @Env() envProperty: string; // process.env.envProperty

  @Env('PROPERTY_NAME') localProperty: string; // process.env.PROPERTY_NAME
}
```

Class properties marked with `@Env()` will be set a value from `process.env`.
If a string parameter is passed, it uses that as the environment variable key.
Otherwise, it will use the name of the property.

## Endpoint

```ts
@Endpoint('GET', '/users', { cors: true })
@Handler()
async getUsers() {}
```

`Endpoint` adds an `http` event to the function's `events` list.
It must be passed an http method and a pathname.
Any additional config can be passed as an object.

## Respond

```ts
@Endpoint('GET', '/users', { cors: true })
@Handler()
@Respond(200, { Header: 'value' })
async getUsers() {
  return ['Bob', 'Kate', 'Giuseppe'];
}
```

`Respond` transforms the return result of the method by making the result a JSON string and adding a status code.
A second headers object parameter is optional.

The above method returns this result:
```js
{
  statusCode: 200,
  headers: { Header: 'value' },
  body: '["Bob","Kate","Giuseppe"]'
}
```

## Body

`Body` is a parameter decorator that passes in the result of `JSON.parse(event.body)`.
If needed, `event` and `context` will still be passed to the method.

```ts
@Handler()
async method(@Body() body, event, context) {
  body === JSON.parse(event.body); // true
}
```
