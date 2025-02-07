//jwtMiddleware.js: This file includes middleware functions for JSON Web Token (JWT) authentication.
//////////////////////////////////////////////////////
// REQUIRE DOTENV MODULE
//////////////////////////////////////////////////////
//Start by requiring the dotenv module to load environment variables from a .env file:
require("dotenv").config();

//////////////////////////////////////////////////////
// REQUIRE JWT MODULE
//////////////////////////////////////////////////////
//Next, require the jsonwebtoken module for working with JSON Web Tokens:
const jwt = require("jsonwebtoken");

//////////////////////////////////////////////////////
// SET JWT CONFIGURATION
//////////////////////////////////////////////////////
//Set the configuration options for JWT using environment variables: 
const secretKey = process.env.JWT_SECRET_KEY;
const tokenDuration = process.env.JWT_EXPIRES_IN;
const tokenAlgorithm = process.env.JWT_ALGORITHM;

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR GENERATING JWT TOKEN
//////////////////////////////////////////////////////
//Create a middleware function named generateToken:
module.exports.generateToken = (req, res, next) => {
    const payload = {
      userId: res.locals.userId,
      timestamp: new Date()
    };
  
    const options = {
      algorithm: tokenAlgorithm,
      expiresIn: tokenDuration,
    };
  
    const callback = (err, token) => {
      if (err) {
        console.error("Error jwt:", err);
        res.status(500).json(err);
      } else {
        res.locals.token = token;
        res.locals.user_id = payload.userId;
        next();
      }
    };
  
    const token = jwt.sign(payload, secretKey, options, callback);
  };
/*This function takes req, res, and next as parameters.
Inside the function:
Define the payload object containing the userId and timestamp.
Set the options object with the algorithm and expiration.
Define a callback function to handle errors and the generated token.
Use the jwt.sign() method to generate a token using the payload, secret key, options, and callback.
If there are no errors, store the generated token in res.locals.token and move to the next middleware or route handler.
If there is an error, handle it by logging an error message and returning a 500 status code.*/

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR SENDING JWT TOKEN
//////////////////////////////////////////////////////
//Create a middleware function named sendToken:
module.exports.sendToken = (req, res, next) => {
    res.status(200).json({
      message: res.locals.message,
      token: res.locals.token,
      user_id: res.locals.user_id
    });
  };

/*This function sends the JWT token in the JSON response.
Set the response status to 200 and send the token along with an optional message. */

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR VERIFYING JWT TOKEN
//////////////////////////////////////////////////////
//Create a middleware function named verifyToken: 
module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const token = authHeader.substring(7);
  
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
  
    const callback = (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
  
      res.locals.userId = decoded.userId;
      res.locals.tokenTimestamp = decoded.timestamp;
  
      next();
    };
  
    jwt.verify(token, secretKey, callback);
  };
  /*This function verifies the JWT token sent in the request headers.
Get the token from the Authorization header and remove the "Bearer " prefix.
Check if the token exists, and if not, return a 401 error response.
Use the jwt.verify() method to verify the token with the secret key and handle the callback.
If there are no errors, store the decoded userId and timestamp in res.locals and move to the next middleware or route handler.
If there is an error, handle it by returning a 401 error response. */