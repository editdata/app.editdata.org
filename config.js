var config = {
  production: {
    client_id: '65dda308caf01e56f912',
    redirect_uri: 'http://editdata.org',
    gatekeeper: 'http://192.241.225.150:9999'
  },
  development: {
    client_id: 'c8ad659e602436645622',
    redirect_uri: 'http://127.0.0.1:9966',
    gatekeeper: 'http://localhost:9999'
  }
}

module.exports = config[process.env.NODE_ENV]
