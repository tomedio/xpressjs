# XpressJS

XpressJS is a set of tools helpful with creating NodeJS applications based on [ExpressJS](https://expressjs.com/) library. It assumes to use following libraries:

- [PrismaORM](https://prisma.io),
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
- [EnvFile](https://www.npmjs.com/package/envfile)
- [Zod](https://zod.dev/)
- [Winston](https://zod.dev/)
- [Express](https://zod.dev/)
- [ExpressHttpContext](https://zod.dev/)
- [uuid](https://zod.dev/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)

## Installation

To add XpressJS library to your project, just use a command specified for your package manager:

- npm:

```shell
npm i tomedio/xpressjs
```

- yarn:

```shell
yarn add tomedio/xpressjs
```

# Features

- [Parsing JSON body](#parsing-json-body)
- [Prisma Client provider](#prisma-client-provider)
- [Getting items list from database](#getting-items-list-from-database)
- [Context](#context)
- [Logging](#logging)
- [Error handling](#error-handling)
- [Success responses](#success-responses)
- [Secure endpoints by JWT](#secure-endpoints-by-jwt)
- [Cryptography](#cryptography)
- [Handling and parsing filters](#handling-and-parsing-filters)
- [.env modification](#env-modification)
- [Request validation](#request-validation)
- [Environment validation](#environment-validation)
- [Synchronous async operations](#synchronous-async-operations)
- [Health check](#health-check)
- [Sleep](#sleep)
- [Resolve Promises with delay](#resolve-promises-with-delay)
- [Fetch API](#fetch-api)

## Parsing JSON body

XpressJS comes with a very simple solution to parse JSON body and to still have access to raw version of it. You just need to use its middleware in the main file like this:

```javascript
const { jsonBody } = require('xpressjs')

// after creating application instance: const app = express()
app.use(jsonBody)
```

Then in your controllers you can access body as:

```javascript
const { username } = req.body
```

In the example above you can fetch `username` field from an object being sent in a request's body.

### Access to raw body

You can get access to raw version of the body if you need it eg. to validate integrity of request. You can find raw body in `req.rawBody` field.

In the example above you can see generating a hash based on request. It can be used to validate integrity if you receive a token generated by a sender:

```javascript
const crypto = require('node:crypto')

const generatedToken = crypto.createHmac('sha256', secret).update(req.rawBody).digest('base64')
```

## Prisma Client provider

It's required to keep only one instance of Prisma Client because it's treated as a separate connection to database. When an application is running for long time, it may happen that more instances can be created accidentally. If this number increases too much, limit of connections can be exceeded.

XpressJS comes with a singleton provider of Prisma Client. In any file you can use it as following:

```javascript
const { db } = require('xpressjs')

const prisma = db.getPrismaClient()
```

Provider makes sure that in the application will be only one instance of Prisma Client.

## Getting items list from database

It's a common task to fetch list of items from database. For pagination purposes we need two elements:

- items found for the given page,
- total items with applied filters - to calculate number of pages.

This problem can be solved in a very easy way using XpressJS. You can use for it `getList` method:

```javascript
const { list } = require('xpressjs')

await list.getList(query, entityObject, pageNumber, pageSize)
```

The function takes parameters:

- `query` - it's a query needed for PrismaORM and build like for being used by eg. `findMany()` method; it needs to contain `where` field, but also `include` and other fields;
- `entityObject` - PrismaOrm entity object available in `prisma` object and generated by the ORM; look at the example below to learn more about it;
- `pageNumber` - number of current page;
- `pageSize` - number of items available on a single page.

Function `getList()` return object with following values:

- `items` - fetched items for the current page;
- `totalItems` - number of all items which can be found with the given criteria;
- `totalPages` - number of all pages which are needed to paginate through all items with the given page size.

Fetching items with number of total items can be done this way:

```javascript
const { list, db } = require('xpressjs')

const prisma = db.getPrismaClient()

// set query values
const categoryId = 5
const pageNo = 2
const pageSize = 20

// in async function
const posts = await list.getList(
  {
    where: {
      categoryId: req.query.categoryId
    },
    include: {
      author: true
    }
  },
  prisma.post,
  pageNo,
  pageSize
)
```

In the example above we assume we have `Post` and `User` models. Post has categoryId property. Post is related to users by a relation on `author` field.
`post` constant contains object with fetched results.

## Context

Usually applications are context-less - all values must be passed explicitly in the code. It's a good practice to improve code readability.

However, sometimes having context can enable new functionalities like request identifier in logs (described below). XpressJS uses `express-http-context` library internally to provide context to your applications.

It is very easy to use it. You just need to initialize context at start of initializing your `app` instance:

```javascript
const { context } = require('xpressjs')

// create `app` instance
context.useContext(app)

// next initialization
```

Then you can use context in every piece of code. You can store data in context under a given key:

```javascript
const { context } = require('xpressjs')

const user = {
  email: 'jdoe@example.com'
}
context.setContext('userData', user)
```

and later get the data in other place:

```javascript
const { context } = require('xpressjs')

const user = context.getContext('userData')
```

You can also update just a part of context data under the key, if data is an object:

```javascript
const { context } = require('xpressjs')

const newData = { name: 'John', surname: 'Doe' }
context.updateContext('userData', newData)

context.getContext('userData') // { email: "jdoe@example.com", name: "John", surname: "Doe" }
```

> **Note:** Context is **NOT** shared between any two separated API calls. It doesn't matter if calls are done in parallel or one by one.

## Logging

XpressJS offers you a global logger which can be configured one time and then can be used in all places where it's needed. Basic logger from the library can be used without any additional configuration. It will just use `console` transport (with handling exceptions) as output and preconfigured formatters.

Default preconfigured logger can be used like this:

```javascript
const { logger } = require('xpressjs')

logger.default.info('Successfull usage of default logger')
```

or to have Logger instance directly under `logger` variable:

```javascript
const {
  logger: { default: logger }
} = require('xpressjs')

logger.info('Successfull usage of default logger')
```

#### Logs format

You can configure logger on your own and determine custom logs format. However, for default logger the format is already defined as:
`[timestamp][app-name][level][request-id]: MESSAGE METADATA`

- `timestamp` - date and time when log has been saved in ISO format
- `app-name` - name of application taken from `package.json` file (`name` property)
- `level` - log's level, eg. info, debug, error, etc.
- `request-id` - optional request identifier; if not enabled, then it's not available in logs
- `MESSAGE` - content of log's message
- `METADATA` - optional JSON serialized with other data passed to the logger while logging

### Configure a logger

Logger functionality is available under `logger` property imported from XpressJS. There is a method - logger getter to get instance of logger. Getter function takes one optional parameter. It is `options` object, which can take the same values as `createLogger` from `winston` library. Passed `options` object is merged with default configuration provided by XpressJS.

> **Note:** You can configure logger in a separate file, eg. `/src/config/logger.js` and import it in all places in your application.

Example configuration for Winston logger:

```javascript
// /src/config/logger.js
const { transports } = require('winston')
const { logger } = require('xpressjs')

module.exports = logger.getLogger({
  transports: [
    new transports.Console({
      handleExceptions: false
    })
  ]
})
```

Then you can import this logger eg. like this:

```javascript
const logger = require('../config/logger')
```

### Request id in logs

You can use context in logs by writing own formatter. However, there is one native functionality in the logger: adding request id to logs. Unique UUID identifier is generated for every request and then attached to every log. This way you can distinguish logs from many requests.

To use request ids you should just add the following code at start of initialization of your ExpressJS app:

```javascript
const { logger: { useRid, getRid } } = require('xpressjs')

// create `app` instance...

logger.useRid(app) // request id initialization

// next initialization...
```

In the example above you don't need additionally to initialize Context functionality as it is done internally. If you want to use Context in the same application for other purposes too, you can do it without having any conflict with request id functionality.

#### Get current request id

To get current request id you can use in code `getRid()` method as follows:
```javascript
const { logger: {getRid} } = require('xpressjs')

// create `app` instance...

logger.useRid(app) // request id initialization

// next initialization...

app.get('/', (req, res) => {
    res.json({ requestId: getRid(), message: 'Request is handled successfully'})
})

// other code...
```

`getRid` method must be used inside a middleware or request handler, but only after request id initialization.

### Customize formatters

Default logger uses built-in formatters. There are two formatters provided by XpressJS library. If you overwrite `format` in `options` parameter of `getLogger` function, you have to use these formatters explicitly in code if you want them.

First is context formatter. It adds context data to the logs. If you want to use request ids in logs, you have to use `context` formatter in new version of `format` option:

```javascript
// /src/config/logger.js
const { format } = require('winston')
const { logger } = require('xpressjs')

const { combine, timestamp, label } = format

module.exports = logger.getLogger({
    format: combine(timestamp(), logger.context(), logger.output),
})
```

`logger.output` is responsible to determine logs format described above. If you don't specify it nor replace it by own formatter, logs will contain serialized data.

## Error handling

XpressJS provides a universal error handling mechanism. It covers functionality of throwing errors, mapping them to HTTP statuses, returning all errors to a requester in the same way and catching a situation when requested endpoint doesn't exist.

### Reporting an error

In amy place of your application you can report a new error just using:

```javascript
const { http } = require('xpressjs')

http.error.createError(404, 'Entity not found')
```

For controller, where you have access to ExpressJS, you can use `next()` function:

```javascript
next(http.error.createError(404, 'Entity not found'))
```

In other parts of your application, you can throw result of the method as an exception:

```javascript
throw http.error.createError(404, 'Entity not found')
```

XpressJS middleware will help you to catch this error and return to requester in a standardized way.

### Handle errors

XpressJS error handler allows you to return all errors in your application in the same way. It does not matter if you throw it like an exception or use `next()` function. It can even display an HTTP 500 message if other exception occurred.

Structure of returned result contains two fields:

- `status`: HTTP status code (integer),
- `message`: human-readable message describing the error (string).

Example error response looks like:

```json
{
  "status": 403,
  "message": "This operation is forbidden for you"
}
```

To handle errors with XpressJS you need to register its middleware after routing in the main app file:

```javascript
const { statusHandler } = require('xpressjs')

// routing is registered here

app.use(statusHandler.handle())
```

`handleErrors()` method can take one argument which is a message returned if other server exception is thrown. If you don't provide it, default message for HTTP 500 will be used.

### Report not existing endpoint

Using XpressJS you can easily report a situation, when a requested endpoint does not exist. To handle it, add the following code at the end of your routing:

```javascript
const { handleNotFound } = require('xpressjs')

router.use(handleNotFound())
```

`handleNotFound` method can take one argument which is a message for the situation when requested endpoint is not found. If you don't provide it, default message for HTTP 404 will be used, eg.:

```javascript
router.use(handleNotFound('API endpoint not found'))
```

### Default messages for statuses

The most common status codes have default messages assigned. In a case you don't give your custom message, a default one will be used. You can customize them for your application. To do this, just run below code before routing in your application:

```javascript
const { http } = require('xpressjs')

http.messages.setDefaultMessages({
  200: 'Created successfully'
  // other status codes with messages
})
```

These status messages are used both by `createError` and `createSuccess` methods.

## Success responses

XpressJS can help with success responses. There are two common situation when it's usable.

### Return a success message

Success message can be returned in the same way as error. It contains fields `status`, `message` and optional one: `object`.

Most common usage is to return a success message in a controller. It can be implemented as shown below.

```javascript
function register(req, res, next) {
  const { email, password, name, surname } = req.body
  registerNewUser(email, password, name, surname) /// this is a model to register a new user
    .then(() => next(createSuccess(201, 'User is created successfully')))
    .catch((error) => next(error))
}
```

Code above will make response as below:

```json
{
  "status": 201,
  "message": "User is created successfully"
}
```

#### Return related object

Sometimes you may need to return object related to the request, e.g. for new user frontend may need identifier created on the backend side.

Below is the same code but additionally object of new user is returned.

```javascript
function register(req, res, next) {
  const { email, password, name, surname } = req.body
  registerNewUser(email, password, name, surname) /// this is a model to register a new user
    .then((user) => next(createSuccess(201, 'User is created successfully', user)))
    .catch((error) => next(error))
}
```

Assuming this request body:

```json
{
  "email": "mail@example.com",
  "password": "8A02XWTv0qHBDEz",
  "name": "John",
  "surname": "Smith"
}
```

code above will make response as below:

```json
{
  "status": 201,
  "message": "User is created successfully",
  "object": {
    "id": 43,
    "email": "mail@example.com",
    "name": "John",
    "surname": "Smith"
  }
}
```

### Return list result

You can use XpressJS to return list of items with an information about all available pages. Response structure is shown below.

Structure of returned response contains two fields:

- `items`: an array of objects containing items,
- `totalPages`: number of all available pages (integer).

Example response looks like:

```json
{
  "items": [],
  "totalPages": 1
}
```

## Secure endpoints by JWT

JWT is a very common solution to protect API against unauthorized access. XpressJS helps you with basic activities related to JWT authentication.

### Set up token secret

Token secret is a confidential value used to verify token. No one should know it. Library needs this value to confirm that received token is the right one.

You can set up this secret in two ways:

1. set it in the environment variable: `JWT_TOKEN_SECRET`;
2. use method from the library to set getter which returns secret:

```javascript
const { jwt } = require('xpressjs')

const getJwtSecret = () => process.env.MY_OWN_SECRET
jwt.setUpTokenSecret(getJwtSecret)
```

Second method must be applied on the start of application - before token verification method is executed.

### Generate JWT token

First part of authentication process is to generate a token and give it to a user. Inside the token you can put additional information like some public user's data.

Generating a token with payload data is done in this way:

```javascript
const { jwt } = require('xpressjs')

// example payload
const userData = {
  email: 'user@example.com'
}

// in an async function
const jwtToken = await jwt.signAccessToken(userData)
```

In the example above you will have JWT token in the `jwtToken` constant. Then you can return it to a user. This token will be used later to authenticate every request and must be attached in a header like this:
`Authentication`:`Bearer <JWT_TOKEN>`

### Verify request

Every request signed by the header:
`Authentication`:`Bearer <JWT_TOKEN>`
can be verified.

Having token in a `token` variable you can use the code below:

```javascript
const { jwt } = require('xpressjs')

jwt
  .verifyAccessToken(token)
  .then((content) => {
    console.log(content.payload) // here is access to the payload set in the token
  })
  .catch((error) => {
    console.log(content.payload) // here you can handle error during veryfing the token
  })
```

#### Token verification as ExpressJS middleware

For simplification XpressJS provides ready-to-use middleware for ExpressJS. This middleware is created by function `authenticate(options)`.
You can just add a code like below in the main file:

```javascript
const { jwt } = require('xpressjs')

app.use(jwt.authenticate())
```

Then all endpoints will be protected by JWT verification. Additionally, in every protected controller you can get access to payload

##### Endpoints whitelist

For security purposes it is a good practice to protect all endpoints as default. However, sometimes it may be needed to skip validation for some endpoints.

You can use options of middleware creator. It has a `whitelist` property. you can put therer an array of whitelisted endpoints. Every endpoint is described by two properties:

- `method` - HTTP method, if not given, then all methods will be allowed;
- `path` - whitelisted path; it can be both string and regular expression.

It's just enough to add this code in the main file:

```javascript
app.use(
  jwt.authenticate({
    whitelist: [{ method: 'GET', path: /\/docs\/?.*/ }]
  })
)
```

## Cryptography

XpressJS gives simple tools related to cryptography.

### Hash a plain password

You should not keep plain passwords in database. It would be a very bad security issue. Instead of it you can save a hashed password. When in a login request you receive plain password, you hash it and compare to a result in a database.

XpressJS has a function to hash a given string: `hashPassword(plainPassword)`. It takes one argument which is a plain password and returns hashed value.

An example to use this function for registration or log in a user can be like this:

```javascript
const { crypto } = require('xpressjs')

// in a controller function (req, res, next):
const hashedPassword = crypto.hashPassword(req.body.password)
```

In `password` field is sent in a JSON body of the request, in `hashedPassword` you will have hashed value of sent password.

### Generate random token

Sometimes you may need to generate a random alphanumeric token, eg. to create access tokens. In this case you can use `generateToken(size=20)` function. It takes size of generated token which is set to 20 as default. Function returns a generated random token.

Example how to use it in a code:

```javascript
const { crypto } = require('xpressjs')

const token = crypto.generateToken(15)
```

`token` variable will contain a string of 15 characters.

## Handling and parsing filters

XpressJS can help with handling query parameters. It offers to take only defined parameters and to parse them if needed.
The library has `filters.get(rawFilters, definition)` method which takes two parameters:

- `rawFilters` - it is an object having all available query parameters, in ExpressJS it's usually `req.query`;
- `definition` - it is an object with definitions of all parameters available in the application.

Definition object has properties having the same names as query parameters. Values are objects which have two fields:

- `default` - required field with default value taken if nothing is passed in a request;
- `parser` - method which takes raw value (string taken from query string) and can return parsed value.

Default value is not parsed using `parser` function.

Example usage of this method is shown below:

```javascript
const { filters } = require('xpressjs')

const parsedFilters = filters.get(req.query, {
  // comma-separated category identifiers
  categories: {
    default: [],
    parser: (raw) => raw?.split(',').map((categoryId) => +categoryId) ?? []
  },
  // published flag can take stringified boolean values: 'true'/'false'
  published: {
    default: true,
    parser: (raw) => raw === 'true'
  },
  // identifier of author; if not given, then no filter can be applied to database query
  author: {
    default: null
  }
})
```

`parsedFilters` contain an object with three filters taken from query and parsed if `parser` method is defined for a filter:

- `categories`,
- `published`,
- `author`.

## .env modification

.env files are often used to set environment variables. Usually in a project these variables are just read, however sometimes you may need to modify them.

This feature can be used when besides API server you write some console commands. You may want eg. to generate token secret for JWT. This operation is shown in the example below:

**Watch-out!** Please note that XpressJS doesn't have any mechanism to reload your application when environment variables changed in .env file. You must do it on your own.

### Add or modify environment variable

To add a set of environment variables to env file you can just use `updateEnv(parameters)` function. It takes one parameter which is a configuration of variables modification operation.
This object may contain three properties:

- `filePath` - path to environment file; as default value is used `.env` file;
- `data` - **mandatory** object with environment variables to be added or modified;
- `override` - a flag informing if changing values of already existing variables is allowed.

Below is an example how to use this function in a real code.

```javascript
const { env, crypto } = require('xpressjs')

env.modifier.updateEnv({
  filePath: '.env.local',
  data: {
    TOKEN_SECRET: crypto.generateToken(64)
  },
  override: true
})
```

This code will add or refresh `TOKEN_SECRET` environment variable located in `.env.local` file.

### Remove existing variable from a file

To remove a set of environment variables you can use `deleteValues(fieldsToDelete, filePath)` function. It takes two parameters:

- `data` - environment variables which should be removed;
- `filePath` - path to environment file; as default value is used `.env` file.

Below is an example how to use this function in a real code.

```javascript
const { env, crypto } = require('xpressjs')

env.modifier.deleteValues(['TOKEN_SECRET'], '.env.local')
```

This code will remove `TOKEN_SECRET` environment variable from `.env.local` file.

## Request validation

Other common functionalities needed in many projects is validation of requests. Most of all endpoints accept only a specific set of parameters both in query string and in body.

XpressJS comes with middleware creators which produces these validators based on passed configuration. It uses [Zod](https://zod.dev/) as a tool to define expected schema.

Below is an example of schema definition in Zod:

```javascript
const { z } = require('zod')

const expectedObject = z.object({
  name: z.string(),
  age: z.number().optional().gte(18),
  quantity: z.number().multipleOf(3),
  product: z.enum(['Apple', 'Banana'])
})
```

In this example there is a definition of object. It has 4 properties:

- `name` - required string;
- `age` - optional number, but must be equal or greater than 18;
- `quantity` - required number being a multiplication of 3, eg. 3, 6, 9, etc.;
- `product` - required string, one of two options: `Apple` or `Banana`.

Object definition like this can be used for both query parameters and request's body validation.

As a better practice of code organization, you can move schema definitions to separate files and then just import it for validation.

### Query parameters validator

The library provides method `validateQuery(expectedQuery, errorHandler)`. It takes two arguments. `expectedQuery` contains Zod schema definition. It allows to create even very extensive schemas to describe even complicated requirements. As `validateQuery` function verifies the whole `req.query` object, it expects to take `zod.object()` in `expectedQuery` parameter. Second argument is a handler for errors if received data doesn't match expected schema.

Below is an example of query parameters validation for `GET /users` endpoint.

```javascript
const express = require('express')
const { validator } = require('xpressjs')
const { z } = require('zod')

const expectedQuery = z.object({
  name: z.string(),
  age: z.number().optional().gte(18)
})

const app = express()

app.get('/users', validator.validateQuery(expectedQuery), (req, res, next) => {
  // body of a controller
})
```

In this example two query parameters are validated. First is `name`. It's expected to be a mandatory string. Second is `age` - an optional number. More information about schema definition in Zod you can find its documentation.

The same job can be done when using router:

```javascript
const router = express.Router()

router.get('/users', validator.validateQuery(expectedQuery), (req, res, next) => {
  // body of a controller
})
```

### Request body validator

The same job as for query parameters can be done with request body. Usually it's an object with properties. You can define for it a Zod schema and use for validation.

XpressJS comes with `validateBody(expectedQuery, errorHandler)` function. It takes the same arguments as `validateQuery()`. First argument is Zod schema definition of request body. Second is a handler for errors if received data doesn't match expected schema.

Below is an example how to use `validateBody()` function.

```javascript
const express = require('express')
const { validator } = require('xpressjs')
const { z } = require('zod')

const expectedQuery = z.object({
  name: z.string(),
  age: z.number().optional().gte(18)
})

const app = express()

app.post('/users', validator.validateBody(expectedQuery), (req, res, next) => {
  // body of a controller
})
```

In this example request body can be an object with two properties. First is `name`. It's expected to be a mandatory string. Second is `age` - an optional number. More information about schema definition in Zod you can find its documentation.

The same job can be done when using router:

```javascript
const router = express.Router()

router.post('/users', validator.validateBody(expectedQuery), (req, res, next) => {
  // body of a controller
})
```

### Handling requests with invalid data

As a default behavior, request validators force ExpressJS application to return HTTP 400 error. They use error response creator `createError()` with messages:

- validateQuery: `Query parameters: ${invalidFields} are invalid`;
- validateBody: `Body fields: ${invalidFields} are invalid`.

`invalidFields` is a string having all fields marked as invalid, separated by `,` comma sign.

You can do nothing to have default behavior. However, if you want to do custom action, you can use `errorHandler` parameter passed to all functions. As default it is undefined.

Error handler can be a function which takes 4 arguments:

- `invalidFields` - string with invalid fields, separated by `,` comma sign;
- `req` - taken from ExpressJS;
- `res` - taken from ExpressJS;
- `next` - taken from ExpressJS.

An example of custom handler is shown below.

```javascript
const express = require('express')
const { validator, logger } = require('xpressjs')
const { z } = require('zod')

const expectedQuery = z.object({
  name: z.string(),
  age: z.number().optional().gte(18)
})

const errorHandler = (invalidFields, req, res, next) => {
  const message = `Invalid fields detected in a request: ${invalidFields}`
  logger.getLogger().error(message)
  next(next(createError(400, message)))
}

const app = express()

app.post('/users', validator.validateBody(expectedQuery, errorHandler), (req, res, next) => {
  // body of a controller
})
```

This example defines a schema and error handler. Later validator uses them and in a case if request has invalid data, such fact is logged and passed to next handlers, eg. middleware from XpressJS which return it to a requester.

## Environment validation

Usually ExpressJS application uses some environment variables. They must be defined before running the application and inside are available as properties of `process.env` object. It may happen that for some reason not all required environment variables are available in the application. It may cause issues, eg. not authorized internal requests to other services when authentication keys are stored in env variables.

To prevent an application even to run without required variables, XpressJS comes with environment validator. It's a method `checkRequiredVars(requiredVariables)`. It takes one argument which is an array of required variable names. Function return a Promise. You can catch an error and decide what you want to do, eg. exit the application with logs.

In `then` part you can handle correct situation if all required variables are available. You can then start ExpressJS server. This handler does not take any arguments.

Situation, if any required variable is not available, will be handled by `catch`. Passed function can take one argument which is an object having two properties:

- `message` - already prepared error message; it is: `Required environment variables: ${notAvailableVariables} are not available` where `notAvailableVariables` is a variable with all non-available env variable names, separated by `,` comma sign;
- `variables` - an array of lacking required environment variable names.

**Watch-out!** Your application must read environment variables before they are validated. You can use [dotenv](https://www.npmjs.com/package/dotenv) package for this purpose.

Example code below shows how to prevent an application to run if not all required environment variables are available.

```javascript
// import environment variables to the application at start
require('dotenv').config()

const { env, logger } = require('xpressjs')

// other parts of main file, including `app` constant initialization

env.validator
  .checkRequiredVars(['JWT_SECRET_TOKEN', 'EXTERNAL_API_TOKEN'])
  .then(() => {
    app.listen(3000, () => {
      logger.getLogger().info('Server is listening on port 3000')
    })
  })
  .catch((error) => {
    // log information about not available variables
    logger.getLogger().error(error.message)
    // exit the application to prevent issues related to lacking variables
    process.exit(1)
  })
```

This example requires `dotenv` package to be installed.

## Synchronous async operations

Asynchronous operations are very common in NodeJS applications. Standard way to handle both success and error is a `then/catch` construction, similar to `try/catch` from non-promised approach. However sometimes you need only to handle result or error and do something with it.

XpressJS comes with simple method to handle asynchronous promises in a more synchronous way. It is offered by `sync()` function which takes Promise object and return object with two properties:

- `error` - error object if reported, otherwise `null` value;
- `result` - result of a promise if everything happened correctly, otherwise `null` value.

`sync()` function handles both cases: success and error. It allows to have the same code for both situations.

Below is an example of how to use `sync()` function. The code contains `getContent` function which handles errors and logs them. If everything is correct, it returns response data.

```javascript
const axios = require('axios')
const { sync } = require('xpressjs')

/**
 * @param {string} url
 * @returns {Promise<?string>}
 */
async function getContent(url) {
  const { error, result } = await sync(axios.get(url))
  if (error) {
    console.log(`Error occured while fetching content: ${error.message}`)
  }
  return result.data
}
```

## Health check

It is a good practice to prepare an endpoint to verify availability of the whole API. XpressJS offers a very simple way to implement basic health check controller under `GET /` path.

To add health check controller you just need to import `healthcheck` function from XpressJS and execute `healthcheck.useHealthCheck` in your main file. An example of basic setup is below:

```javascript
const express = require('express')
const { healthcheck } = require('xpressjs')

const app = express()
healthcheck.useHealthCheck(app)
```

Code above health check endpoint of the application. This endpoint is available under the path: `GET /` and returns result with `application/json` type. Result looks like this:

```json
{
  "app": {
    "name": "your-app-name",
    "version": "1.2.3"
  },
  "date": "2023-11-10T18:35:21.145Z",
  "result": "success"
}
```

Fields mean:

- `app.name` - application name taken from `name` field in `package.json` file;
- `app.version` - application version taken from `version` field in `package.json` file;
- `date` - date and time of calling the endpoint;
- `result` - constant `success` string, always the same.

### Customize health check endpoint

Generally health check endpoint is `/`. However, you may want to change it sometimes, eg. when your whole application works under `/app` or `/api` prefix.

```javascript
const express = require('express')
const { healthcheck } = require('xpressjs')

const app = express()
healthcheck.useHealthCheck(app, '/api')
```

### Customize health check controller

You may want to do additional checks when health check controller is called. You can do it just by passing second argument to `useHealthCheck` function. If you pass a value there, it must be a function taking three arguments like every Express controller: `req`, `res` and `next`. You don't need to use these parameters.

Callback function should return nothing or an object. If object is returned, it will be merged with default health check result and returned as a response.

Below is an example of custom callback which checks availability of additional services.

```javascript
const express = require('express')
const { healthcheck } = require('xpressjs')

const app = express()

function healthCheckCallback(req, res, next) {
  return {
    availability: {
      db: true,
      cdn: true,
      sap: false
    }
  }
}
healthcheck.useHealthCheck(app, '/', healthCheckCallback)
```

When you call `GET /` endpoint, you get result like this:

```json
{
  "app": {
    "name": "your-app-name",
    "version": "1.2.3"
  },
  "date": "2023-11-10T18:35:21.145Z",
  "result": "success",
  "availability": {
    "db": true,
    "cdn": true,
    "sap": false
  }
}
```

### Health check controller

You may want to implement health check endpoint in a different way than proposed by XpressJS library. Besides ready-to-use solution it provides to you a simple controller which you can just connect to any path you need. To use it you need to import `healthcheck.controller` like it's shown below.

```javascript
const express = require('express')
const { healthcheck } = require('xpressjs')

const app = express()
app.get('/healthcheck', healthcheck.controller)
```

It will make health check controller available under `GET /healthcheck` path.

## Sleep

XpressJS library offers a simple `sleep()` function to stop executing an application and wait for a concrete time before continuing. It can be used eg. to ensure that application will not fail because of rate limit of external APIs.

`sleep` function takes one parameter which is number of milliseconds determining length of the break. An example code is shown below.

```javascript
const { sleep } = require('xpressjs')

async function updateResources(resources) {
  for (const resource of resources) {
    await updateResource(resource)
    await sleep(200)
  }
}
```

In the example `updateResources` function executes `updateResource` function for every passed resource. `updateResource` uses external API which permits to be called only 6 times per a second. `sleep` function will stop execution for 200ms after updating every resource to make sure that all requests will meet the rate limit.

## Resolve Promises with delay

Usually you want the application to execute the code as fast as possible. However, because of some restrictions like external API's rate limit you have to wait between next calls. You may use `sleep()` function from XpressJS, but the library comes with next functionality designed specially for asynchronous operations.

API calls are always realized as Promises. If needed, you may use `delayed` function. It takes two parameters:
* `p` - this is Promise object which should be resolved after a time;
* `delay` - number of milliseconds that must elapse before Promise can be resolved.

Example usage:
```javascript
const { delayed } = require('xpressjs')

async function getData(pageNo) {
    // implementation of fetching paginated data from external API
}

const totalPages = 10;
const pages = Array.apply(null, {length: totalPages + 1}).map(Number.call, Number).slice(1);

let allData = []
for (const pageNo = 1; pageNo <= totalPages; pageNo++) {
    const pageData = await delayed(getData(pageNo), 500); // delay 500ms before resolving the given promise
    allData = [ ...allData, ...pageData]
}
```

## Fetch API

Node.js does not have implemented Fetch API natively. You can use `node-fetch` package for this purpose. However, the package is ESM-only module. If you want to use Fetch API in a project where you use CommonJS modules, XpressJS comes with a solution.

You can just import `fetch` like in the example below:
```javascript
const { fetch } = require('xpressjs');

const response = await fetch('https://example.com');
```