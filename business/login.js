const generateUuid = require('uuid');
const PASSWORD = "watermelon";
const AUTH_TOKEN = "719e36b1-0a33-4f68-8047-017c57c61dba";

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