// THIS IS MIDDLEWARE
const AUTH_TOKEN = process.env["AUTH_TOKEN"];

function authenticate(req, res, next) {
  if (req.originalUrl.includes('login') || req.headers.token == AUTH_TOKEN || !req.originalUrl.includes('api')) {
    next();
    return;
  }
  
  if (!req.headers.token || req.headers.token != AUTH_TOKEN) {
    res.status(401).json({error: "No authentication"});
  } 
}

module.exports = authenticate;