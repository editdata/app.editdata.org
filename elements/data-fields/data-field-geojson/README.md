# data-field-geojson

## API

### createGeoJSONField

Create a virtual-dom geojson data-field for use with [data-ui](https://github.com/editdata/data-ui).


**Parameters**

-   `options` **Object** an options object, including any properties you can pass to leaflet & virtual-dom/h
    -   `options.accessToken` **String** mapbox access token for using their API

    -   `options.tileLayer` **Object** Leaflet tilelayer, default is osm tiles

    -   `options.imagePath` **String** path to leaflet images

    -   `options.display` **Boolean** true for display mode, default is false for input mode



**Examples**

```javascript
var createGeoJSONField = require('data-field-geojson')
var field = createGeoJSONField(options)
field.render(h, {}, geojsonObject)
```




### field.render

Render the virtual-dom geojson data-field.


**Parameters**

-   `h` **function** virtual-dom `h` function

-   `properties` **Object** an options object, including any properties you can pass to leaflet & virtual-dom/h
    -   `properties.display` **Boolean** true for display mode, default is false for input mode

    -   `properties.value` **Object** a geojson Feature or Featurecollection

-   `value` **Object** a geojson Feature or Featurecollection



**Examples**

```javascript
var createGeoJSONField = require('data-field-geojson')
var field = createGeoJSONField(options)
field.render(h, properties, geojsonObject)
```

## Installation

```sh
npm install data-field-geojson --save
```

Or install the [data-fields](https://github.com/editdata/data-fields) module:
```sh
npm install data-fields --save
```

Right now this module relies on leaflet v1.0.0-beta2, and you must build the dependency manually:

```
cd node_modules/leaflet
npm install
npm run build
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
