# data-field-list

## API

### createListField

Create a virtual-dom list (object or array) data-field for use with [data-ui](https://github.com/editdata/data-ui).


**Parameters**

-   `options` **Object** an options object, including any properties you can pass to virtual-dom/h
    -   `options.display` **Boolean** true for display mode, default is false for input mode

    -   `options.keys` **Boolean** , false for array mode, default is true for object mode



**Examples**

```javascript
var createListField = require('data-field-string')
var field = createListField()
var tree = field.render(h, properties, ['a', 'b', 'c'])
```




### createListField

Create a virtual-dom list (object or array) data-field for use with [data-ui](https://github.com/editdata/data-ui).


**Parameters**

-   `h` **function** virtual-dom `h` function

-   `properties` **Object** an options object, including any properties you can pass to virtual-dom/h
    -   `properties.display` **Boolean** true for display mode, default is false for input mode

    -   `properties.keys` **Boolean** , false for array mode, default is true for object mode

    -   `properties.value` **Object** an array or flat object

    -   `properties.value` **Array** an array or flat object

-   `value` **Object** an array or flat object

-   `value` **Array** an array or flat object



**Examples**

```javascript
var createListField = require('data-field-string')
var field = createListField()
var tree = field.render(h, properties, ['a', 'b', 'c'])
```

## Installation

```sh
npm install data-field-list --save
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
