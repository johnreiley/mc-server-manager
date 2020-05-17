const { startServer, stopServer, getServerStatus } = require('../business/mc-server.js');
var express = require('express');
var router = express.Router();

router.get('/api/start-server', startServer);

router.get('/api/stop-server', stopServer);

router.get('/api/server-status', getServerStatus);

module.exports = router;