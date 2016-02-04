var config = {
  production: {
    client_id: '65dda308caf01e56f912',
    redirect_uri: 'http://editdata.org',
    gatekeeper: 'http://192.241.225.150:9999'
  },
  development: {
    client_id: 'e6fa0762c3c6db05d59e',
    redirect_uri: 'http://localhost:9966',
    gatekeeper: 'http://localhost:9999'
  }
}

module.exports = config[process.env.NODE_ENV]
