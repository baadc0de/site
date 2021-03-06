title: Errors
---
Moleculer has some error classes. You can use it when you raise an error in services.

## Base error classes

### `MoleculerError`
The base error class.

**Parameters**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `message` | `String` |  | Error message |
| `code` | `Number` | `500` | Error code |
| `type` | `String` |  | Error type |
| `data` | `any` |  | Any relevant data |

**Example**
```js
const { MoleculerError } = require("moleculer").Errors;

throw new MoleculerError("Something happened", 501, "ERR_SOMETHING", { a: 5, nodeID: "node-666" }));
```

### `MoleculerRetryableError`
Moleculer Error for retryable errors. If the caller set `retry` in [calling options](broker.html#Retries) and get this `MoleculerRetryableError`, it will try to recall it.

**Parameters**

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `message` | `String` |  | Error message |
| `code` | `Number` | `500` | Error code |
| `type` | `String` |  | Error type |
| `data` | `any` |  | Any relevant data |

**Example**
```js
const { MoleculerRetryableError } = require("moleculer").Errors;

throw new MoleculerRetryableError("Some retryable thing happened", 501, "ERR_SOMETHING", { a: 5, nodeID: "node-666" }));
```

### `MoleculerServerError`
Moleculer Error for server errors which is retryable. Parameters are same as `MoleculerRetryableError`.


### `MoleculerClientError`
Moleculer Error for client error which is **not** retryable. Parameters are same as `MoleculerRetryableError`.

## Internal error classes

### `ServiceNotFoundError `
Throw it if you `call` a not registered service action.
Error code: **404**
Retryable: **false**

**Data properties**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `action` | `String` | Action name |
| `nodeID` | `String` | Node ID. It has value only at direct call. |

### `ServiceNotAvailable`
Throw it if you `call` a currently unavailable service action. E.g. nodes disconnected which contains this service or circuit breaker opened.
Error code: **404**
Retryable: **false**

**Data properties**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `action` | `String` | Action name |
| `nodeID` | `String` | Node ID. It has value only at direct call. |

### `RequestTimeoutError`
Throw it if your `broker.call` is timed out.
Error code: **504**
Retryable: **true**

**Data properties**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `action` | `String` | Action name |
| `nodeID` | `String` | Node ID. It has value only at direct call. |

### `RequestSkippedError`
Throw it if your sub call is skipped because the execution is timed out.
Error code: **514**
Retryable: **false**

**Data properties**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `action` | `String` | Action name |
| `nodeID` | `String` | Node ID. It has value only at direct call. |

### `MaxCallLevelError`
Throw it if your sub calls reached the `maxCallLevel` value to avoid infinite calling loops.
Error code: **500**
Retryable: **false**

**Data properties**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `level` | `Number` | Current calling level |

### `ValidationError`
Validator throws it if calling parameters are not valid.
Error code: **422**
Retryable: **false**


### `ServiceSchemaError`
Throw it if your service schema is not valid.
Error code: **500**
Retryable: **false**

### `ProtocolVersionMismatchError`
Throw it if an old nodeID connected which uses an older protocol.
Error code: **500**
Retryable: **false**

**Data properties**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `nodeID` | `String` | Node ID. It has value only at direct call. |
| `actual` | `String` | Actual version |
| `received` | `String` | Received version from node |