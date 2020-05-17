mcServerEndpoints = require('./endpoints/mc-server.js');
const app = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const PORT = process.env.PORT || 5000;

app()
  .use(function (req, res, next) {
    console.log(`Request at: ${req.url}`)
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  })
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(app.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .use(require('./routes'))
  .use(mcServerEndpoints)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));