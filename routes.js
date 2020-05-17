var express = require('express');
var path = require('path');
var router = express.Router();
var fetch = require('node-fetch');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.get('/', (req, res) => res.sendFile('index.html', {
    root: __dirname + "/public"
}))

module.exports = router;