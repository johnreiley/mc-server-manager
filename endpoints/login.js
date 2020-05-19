const { login } = require('../business/mc-server.js');
var express = require('express');
var router = express.Router();

router.get('/login', login);

module.exports = router;