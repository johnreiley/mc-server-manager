const generateUuid = require('uuid');
const PASSWORD = process.env["PASSWORD"];
const AUTH_TOKEN = process.env["AUTH_TOKEN"];

function login(req, res) {
  if (req.headers.password && req.headers.password == PASSWORD) {
    res.status(200).json({ success: true, token: AUTH_TOKEN })
  } else {
    res.status(401).json({ success: false, error: "Login failed" })
  }
}

module.exports = { login };



function generateAuthToken() {
  return {
    date: new Date.now(),
    authToken: generateUuid()
  }
}