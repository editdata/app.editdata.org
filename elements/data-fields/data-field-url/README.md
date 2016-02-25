# data-field-url

## API

### createURLField

Create a virtual-dom url data-field for use with [data-ui](https://github.com/editdata/data-ui).

**Parameters**

-   `options` **Object** an options object, including any properties you can pass to virtual-dom/h
    -   `options.display` **Boolean** true for display mode, default is false for input mode


**Examples**

```javascript
var createURLField = require('data-field-url')
var field = createURLField()
var vtree = field.render(h, {}, 'http://example.com')
```

### createURLField

Create a virtual-dom url data-field for use with [data-ui](https://github.com/editdata/data-ui).

**Parameters**

-   `h` **function** virtual-dom `h` function

-   `properties` **Object** an options object, including any properties you can pass to virtual-dom/h
    -   `properties.display` **Boolean** true for display mode, default is false for input mode

    -   `properties.value` **String** any url

-   `value` **String** any url


**Examples**

```javascript
var createURLField = require('data-field-url')
var field = createURLField()
var vtree = field.render(h, {}, 'http://example.com')
```

## Installation

```sh
npm install data-field-url --save
```

Or install the [data-fields](https://github.com/editdata/data-fields) module:
```sh
npm install data-fields --save
```

## Tests

```sh
npm install
npm test
```

## See also

-   [data-fields](https://github.com/editdata/data-fields) – all data fields packaged together.
-   [data-ui](https://github.com/editdata/data-ui) – a collection of modules for managing data.

## License

[MIT](LICENSE.md)
