// THIS IS MIDDLEWARE
const AUTH_TOKEN = "719e36b1-0a33-4f68-8047-017c57c61dba";

function authenticate(req, res, next) {
  if (req.originalUrl.includes('login') || req.headers.token == AUTH_TOKEN) {
    next();
  }
  
  if (!req.headers.token || req.headers.token != AUTH_TOKEN) {
    res.status(401).json({error: "No authentication"});
  } 

}

module.exports = authenticate;