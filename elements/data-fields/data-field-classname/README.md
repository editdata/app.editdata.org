# data-field-classname

Small function used internally in [data-fields](http://github.com/editdata/data-fields) modules.

## Usage

```js
var createClassName = require('data-field-classname')

var className = createClassName({
  dataType: 'string',
  fieldType: 'display',
  size: 'normal'
})
// returns: 'data-field data-field-string data-field-display data-field-display-normal'
```

## License
MIT