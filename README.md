# app.editdata.org

[![editdata](http://editdata.org/assets/editdata-1080x720.png)](http://editdata.org)

## Getting Started

* Register a new developer application on Github ([link][new dev application])
  * Homepage URL: `http://localhost:9966`
  * Authorization Callback URL: `http://localhost:9966`
* Clone the [gatekeeper] repository
  * add your Github application's client id and secret to gatekeeper's `config.json`
  * start gatekeeper by running `npm start` inside the gatekeeper directory.
* Clone this repository
* copy `example.config.js` to `config.js`: `cp example.config.js config.js`
* add your Github client_id to the `development` config in `config.js`
* run `npm install && npm run bundle` to get set up
* run `npm start` for the server
* visit <http://localhost:9966>

[new dev application]: https://github.com/settings/applications/new
[gatekeeper]: https://github.com/prose/gatekeeper

## About

EditData is a set of tools for collaborating on data.

EditData was previously named Flatsheet. We renamed the project to take focus away from the idea of spreadsheets, to expand the scope to editing data in a variety of ways.

## Contributing

[Read more about how to contribute to editdata.org.](CONTRIBUTING.md)

## License

[MIT](LICENSE.md)
