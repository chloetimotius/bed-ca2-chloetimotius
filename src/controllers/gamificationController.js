// ##############################################################
// REQUIRE MODULES
// ##############################################################
// Import the gamification model to interact with the database
const gamificationModel = require("../models/gamificationModel");

// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR READ ALL CHARACTERS' ABILITIES
// ##############################################################
/*
 - Controller to retrieve all characters' abilities.
 - Fetches data from the database and returns a response with the list of abilities.
 */
module.exports.readAllCharactersAbilities = (req, res, next) => {
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllAbility:", error);
                res.status(500).json(error);
            } else {
                res.status(200).json(results);
            }
        };

        //Call the model function to select all characters' ability
        gamificationModel.selectAll(callback);
    };


// ##############################################################
// CONTROLLER FUNCTION TO LEVEL UP CHARACTER WITH SKILL POINTS
// ##############################################################
/*
  This function handles the HTTP request to level up a character.
  It checks if the user has enough skill points and then calls the model function to level up the character.
*/
module.exports.levelUpCharacter = (req, res, next) => {
    const { user_id, ability_id, skill_points } = req.body; // Extract user_id, character_id, and skill_points from the request body
  
    // Call the model to level up the character
    gamificationModel.levelUpCharacter(user_id, ability_id, skill_points, (error, result) => {
      if (error) {
        return res.status(500).json({ error: error.error });
      }
      res.status(200).json(result);
    });
  };
  
  // ##############################################################
  // CONTROLLER FUNCTION TO RETRIEVE LEADERBOARD DATA
  // ##############################################################
  /*
    This function handles the HTTP request to retrieve the leaderboard by lvl of character's ability.
  */
    module.exports.readLeaderboard = (req, res) => {
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllAbility:", error);
                res.status(500).json(error);
            } else {
                res.status(200).json(results);
            }
        };

        //Call the model function to select all characters' ability
        gamificationModel.getLeaderboard(callback);
    };