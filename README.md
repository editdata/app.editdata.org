# [editdata.org](http://editdata.org)

## Getting Started

* Register a new developer application on Github.
* Clone the [gatekeeper](https://github.com/prose/gatekeeper) repository, add your Github keys to `config.json`, and run gatekeeper.
* Clone this repository and add your Github client_id to the `development` config in `config.js`
* run `npm run bundle` and `npm start`

## About
editdata.org repurposes components from [flatsheet](http://github.com/flatsheet/flatsheet) to provide a a simple free tool for editing data.

Currently the app is limited to editing & publishing data from gists. Each dataset creates a gist with 3 important files:

- data.json, a json file with an array of objects in `{ key: '', value: {} }` format. All the data is in the `value` property.
- data.csv, a csv file that you can import into various software.
- metadata.json, a json file that for now only contains the names of columns.

## Contributing

[Read more about how to contribute to editdata.org.](CONTRIBUTING.md)

## License
[MIT](LICENSE.md)
