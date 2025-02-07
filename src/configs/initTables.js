// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require("../services/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
};

// Hash the password
bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    // ##############################################################
    // DEFINE SQL STATEMENTS
    // ##############################################################
    const SQLSTATEMENT = `
      SET FOREIGN_KEY_CHECKS = 0;

      -- Drop tables if they exist
      DROP TABLE IF EXISTS UserCompletion;
      DROP TABLE IF EXISTS FitnessChallenge;
      DROP TABLE IF EXISTS Ability;
      DROP TABLE IF EXISTS User;
      DROP TABLE IF EXISTS Reviews;

      SET FOREIGN_KEY_CHECKS = 1;

      -- Create User table
      CREATE TABLE User (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        skillpoints INT DEFAULT 0
      );

      -- Create FitnessChallenge table
      CREATE TABLE FitnessChallenge (
        challenge_id INT PRIMARY KEY AUTO_INCREMENT,
        creator_id INT NOT NULL,
        challenge TEXT NOT NULL,
        skillpoints INT NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES User(user_id)
      );

      -- Create UserCompletion table
      CREATE TABLE UserCompletion (
        complete_id INT PRIMARY KEY AUTO_INCREMENT,
        challenge_id INT NOT NULL,
        user_id INT NOT NULL,
        completed BOOL NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (challenge_id) REFERENCES FitnessChallenge(challenge_id),
        FOREIGN KEY (user_id) REFERENCES User(user_id)
      );

      -- Create Ability table (Independent of User)
      CREATE TABLE Ability (
        ability_id INT PRIMARY KEY AUTO_INCREMENT,
        character_name TEXT NOT NULL,
        ability_name TEXT NOT NULL,
        level INT DEFAULT 1
      ); 

      CREATE TABLE Reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        review_amt INT NOT NULL,
        user_id INT NOT NULL,
        challenge_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Inserting initial data into User table
      INSERT INTO User (username, email, password) VALUES
        ('admin', 'a@a.com', '${hash}'),
        ('fedya', 'doa.com', '${hash}'),
        ('kolya', 'rat.com', '${hash}'),
        ('dazai', 'ada.com', '${hash}'),
        ('ranpo', 'poe.com', '${hash}');

      -- Inserting challenges into FitnessChallenge table
      INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints) VALUES
      (1, 'Complete 2.4km within 15 minutes', 50),
      (2, 'Cycle around the island for at least 50km', 100),
      (3, 'Complete a full marathon (42.2km)', 200),
      (4, 'Hold a plank for 5 minutes', 50),
      (5, 'Perform 100 push-ups in one session', 75);

      -- Inserting completion records into UserCompletion table
      INSERT INTO UserCompletion (challenge_id, user_id, completed, notes) VALUES
      (1, 1, TRUE, 'Completed in 12 minutes'),
      (2, 1, FALSE, 'Attempted 30km, did not finish'),
      (3, 2, TRUE, 'Full marathon completed in 4 hours');

      -- Inserting abilities into Ability table
      INSERT INTO Ability (character_name, ability_name, level) VALUES
      ('Atsushi Nakajima', 'Beast Beneath the Moonlight', 1),  -- Atsushi
      ('Osamu Dazai', 'No Longer Human', 1),                   -- Dazai
      ('Doppo Kunikida', 'Perfect Plan', 1),                   -- Kunikida
      ('Edogawa Ranpo', 'Super Deduction', 1),                   -- Ranpo
      ('Fyodor Dostoevsky', 'Crime and Punishment', 1),           -- Fyodor
      ('Nikolai Gogol', 'The Overcoat', 1);                   -- Nikolai

      -- Inserting reviews into Reviews table
      INSERT INTO Reviews (review_amt, user_id, challenge_id) VALUES
      (1, 1, 3),
      (5, 2, 2),  
      (3, 3, 1);
      `;

    // ##############################################################
    // RUN SQL STATEMENTS TO CREATE TABLES
    // ##############################################################
    pool.query(SQLSTATEMENT, (error, results, fields) => {
      if (error) {
        console.error("Error creating tables:", error);
      } else {
        console.log("Tables created and data inserted successfully");
      }
      process.exit();
    });
  }});    
