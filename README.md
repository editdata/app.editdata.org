# [editdata.org](http://editdata.org)

## Getting Started

* Register a new developer application on Github ([link][new dev application])
  * Homepage URL: `http://localhost:9966`
  * Authorization Callback URL: `http://localhost:9966`
* Clone the [gatekeeper] repository
  * add your Github application's client id and secret to gatekeeper's `config.json`
  * run gatekeeper.
* Clone this repository
* add your Github client_id to the `development` config in `config.js`
* run `npm install && npm bundle` to get set up
* run `npm start` for the server
* visit <http://localhost:9966>

[new dev application]: https://github.com/settings/applications/new
[gatekeeper]: https://github.com/prose/gatekeeper

## About

editdata.org repurposes components from [flatsheet]
to provide a simple free tool for editing data.

[flatsheet]: https://github.com/settings/applications/new

## Contributing

[Read more about how to contribute to editdata.org.](CONTRIBUTING.md)

## License

[MIT](LICENSE.md)
