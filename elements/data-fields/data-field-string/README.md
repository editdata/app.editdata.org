# data-field-string

## API

### createStringField

Create a virtual-dom string data-field for use with [data-ui](https://github.com/editdata/data-ui).


**Parameters**

-   `options` **Object** an options object, including any properties you can pass to virtual-dom/h
    -   `options.display` **Boolean** true for display mode, default is false for input mode



**Examples**

```javascript
var createStringField = require('data-field-string')
var field = createStringField()
var vtree = field.render(h, {}, 'example string')
```




### createStringField

Create a virtual-dom string data-field for use with [data-ui](https://github.com/editdata/data-ui).


**Parameters**

-   `h` **function** virtual-dom `h` function

-   `properties` **Object** an options object, including any properties you can pass to virtual-dom/h
    -   `properties.display` **Boolean** true for display mode, default is false for input mode

    -   `properties.value` **String** any string

-   `value` **String** any string



**Examples**

```javascript
var createStringField = require('data-field-string')
var field = createStringField()
var vtree = field.render(h, {}, 'example string')
```

## Installation

```sh
npm install data-field-string --save
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
