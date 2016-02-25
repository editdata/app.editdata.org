# data-field-image

## API

### createImageField

Create a virtual-dom image data-field for use with [data-ui](https://github.com/editdata/data-ui).


**Parameters**

-   `options` **Object** options object
    -   `options.display` **Boolean** true for display mode, default is false for input mode



**Examples**

```javascript
var createImageField = require('data-field-image')
var field = createImageField(options)
var tree =  field.render(h, props, 'http://example.com/example.jpg')
```




### createImageField

Render a virtual-dom image data-field.


**Parameters**

-   `h` **function** virtual-dom `h` function

-   `properties` **Object** properties object for `h`
    -   `properties.display` **Boolean** true for display mode, default is false for input mode

    -   `properties.value` **String** any image url

-   `value` **String** any image url



**Examples**

```javascript
var createImageField = require('data-field-image')
var field = createImageField(options)
var tree = field.render(h, props, 'http://example.com/example.jpg')
```


## Installation

```sh
npm install data-field-image --save
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
