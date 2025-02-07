//bcryptMiddleware.js: This file includes middleware functions for bcrypt password hashing.
//////////////////////////////////////////////////////
// REQUIRE BCRYPT MODULE
//////////////////////////////////////////////////////
const bcrypt = require("bcrypt");
//The bcrypt module provides functions for hashing and comparing passwords.

//////////////////////////////////////////////////////
// SET SALT ROUNDS
//////////////////////////////////////////////////////
const saltRounds = 10;
//The number of salt rounds determines the complexity of the password hashing algorithm. Increasing the number of rounds improves security but also increases the time it takes to hash the password.

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR COMPARING PASSWORD
//////////////////////////////////////////////////////
//Create the middleware function for comparing passwords by adding the following code: 

module.exports.comparePassword = (req, res, next) => {
    // Check password
    const callback = (err, isMatch) => {
      if (err) {
        console.error("Error bcrypt:", err);
        res.status(500).json(err);
      } else {
        if (isMatch) {
          next();
        } else {
          res.status(401).json({
            message: "Wrong password",
          });
        }
      }
    };
    bcrypt.compare(req.body.password, res.locals.hash, callback);
  };

  /*The comparePassword function is a middleware that compares the password provided in the request body with the hashed password stored in res.locals.hash.
If the passwords match, it calls the next() function to move to the next middleware or route handler.
If the passwords do not match, it returns a response with a status code of 401 (Unauthorized) and a JSON message indicating that the password is wrong. */

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR HASHING PASSWORD
//////////////////////////////////////////////////////
//Create the middleware function for hashing passwords by adding the following code: 

module.exports.hashPassword = (req, res, next) => {
    const callback = (err, hash) => {
      if (err) {
        console.error("Error bcrypt:", err);
        res.status(500).json(err);
      } else {
        res.locals.hash = hash;
        next();
      }
    };
  
    bcrypt.hash(req.body.password, saltRounds, callback);
  };
  /*The hashPassword function is a middleware that hashes the password provided in the request body using the specified number of salt rounds (saltRounds).
It stores the hashed password in res.locals.hash for later use.
If an error occurs during the hashing process, it returns a response with a status code of 500 (Internal Server Error) and the error object.
If the hashing is successful, it calls the next() function to move to the next middleware or route handler. */