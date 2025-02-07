// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// ##############################################################
// DEFINE FUNCTION TO CHECK IF USERNAME EXISTS
// ##############################################################
/*
  Check if a username already exists in the User table.
 */
module.exports.checkUsernameExists = (username, callback) => {
    const SQLSTATEMENT = `
      SELECT * FROM User WHERE username = ?;
    `;
    
    pool.query(SQLSTATEMENT, [username], callback);
};

// ##############################################################
// DEFINE INSERT OPERATION FOR USER
// ##############################################################
/*
  Add a new user to the User table.
 */
module.exports.createUser = (data, callback) => {
    const SQLSTATEMENT = `
      INSERT INTO User (username, skillpoints) 
      VALUES (?, ?);
    `;

    pool.query(SQLSTATEMENT, [data.username, data.skillpoints], callback);
};

// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR USER
// ##############################################################
/*
  Fetch all users from the User table.
 */
module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
          SELECT * FROM User;
          `;
    
        pool.query(SQLSTATMENT, callback);
    }

// ##############################################################
// DEFINE SELECT BY ID OPERATIONS FOR USER
// ##############################################################
module.exports.selectById = (data, callback) =>
  {
      const SQLSTATMENT = `
        SELECT * FROM User
        WHERE user_id = ?;
        `;
      const VALUES = [data.user_id];
  
      pool.query(SQLSTATMENT, VALUES, callback);
  }

// ##############################################################
// DEFINE UPDATE OPERATIONS FOR USER
// ##############################################################
/*
  Update a user's details by their user_id.
 */
module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET username = ?, email = ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.username, data.email, data.user_id];
  
    pool.query(SQLSTATEMENT, VALUES, callback);
  };
  
  //////////////////////////////////////////////////////
// SELECT USER BY USERNAME
//////////////////////////////////////////////////////
module.exports.selectByUsername = (data, callback) =>
  {
      const SQLSTATMENT = `
      SELECT * FROM User
      WHERE username = ?;
      `;
  const VALUES = [data.username];
  
  pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.createUser = (data, callback) =>
  {
      const SQLSTATMENT = `
      INSERT INTO User (username, email, password)
      VALUES (?, ?, ?);
      `;
  const VALUES = [data.username, data.email, data.hashedPassword];
  
  pool.query(SQLSTATMENT, VALUES, callback);
}

//////////////////////////////////////////////////////
// SELECT USER BY USERNAME OR EMAIL
//////////////////////////////////////////////////////
module.exports.selectByUsernameOrEmail = (data, callback) =>
  {
      const SQLSTATMENT = `
      SELECT * FROM User
      WHERE username = ? and email =?;
      `;
  const VALUES = [data.username, data.email];
  
  pool.query(SQLSTATMENT, VALUES, callback);
}