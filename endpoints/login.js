const { login } = require('../business/login.js');
var express = require('express');
var router = express.Router();

router.get('/api/login', login);

module.exports = router;