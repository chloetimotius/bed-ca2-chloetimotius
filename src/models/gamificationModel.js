// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR ABILITIES
// ##############################################################
/*
  This function retrieves all abilities from the database.
  It fetches every entry from the `Ability` table.
*/
module.exports.selectAll = (callback) => {
        const SQLSTATMENT = `
          SELECT * FROM Ability;
          `;
    
        pool.query(SQLSTATMENT, callback);
    };

// ##############################################################
// DEFINE FUNCTION TO LEVEL UP CHARACTER WITH SKILL POINTS
// ##############################################################
/*
  This function allows a user to level up their character by spending skill points.
  It checks if the user has enough skill points and then updates the user's level and remaining skill points.
*/
module.exports.levelUpCharacter = (user_id, ability_id, skill_points, callback) => {
  console.log('Parameters received: user_id =', user_id, ', ability_id =', ability_id, ', skill_points =', skill_points); // Log the parameters
  
  const getUserQuery = 'SELECT * FROM User WHERE user_id = ?';
  pool.query(getUserQuery, [user_id], (error, results) => {
      if (error) return callback({ error: "Database error" });

      if (results.length === 0) return callback({ error: "User not found" });

      const user = results[0];
      console.log('User data retrieved:', user); // Log the entire user data

      console.log('Current skill points:', user.skillpoints); // Log the current skill points

      // Check if the user has enough skill points for leveling up
      if (user.skillpoints >= 50) {  // Check if the user has enough skill points (50 required)
        const newSkillPoints = user.skillpoints - 50;  // Deduct 50 points for leveling up
        console.log('New skill points after deduction:', newSkillPoints);  // Log the updated points
    
        // Proceed to update the ability
        const getAbilityQuery = 'SELECT * FROM Ability WHERE ability_id = ?';
        pool.query(getAbilityQuery, [ability_id], (abilityError, abilityResults) => {
            if (abilityError) return callback({ error: "Error retrieving abilities" });
    
            const ability = abilityResults[0];
            if (!ability) return callback({ error: "Ability not found for this ability_id" });
    
            // Update the ability level (increment by 1)
            const updateAbilityQuery = 'UPDATE Ability SET level = level + 1 WHERE ability_id = ?';
            pool.query(updateAbilityQuery, [ability_id], (updateErr) => {
                if (updateErr) return callback({ error: "Error updating ability level" });
    
                // Update user skill points after leveling up
                const updateUserQuery = 'UPDATE User SET skillpoints = ? WHERE user_id = ?';
                pool.query(updateUserQuery, [newSkillPoints, user_id], (updateErr) => {
                    if (updateErr) return callback({ error: "Error updating user skill points" });
    
                    console.log('Skill points updated successfully! Remaining points:', newSkillPoints);
    
                    // Send the success message with remaining points
                    callback(null, { message: "Character leveled up successfully", remaining_points: newSkillPoints });
                });
            });
        });
    } else {
        callback({ error: "Not enough skill points to level up" });
    }    
  });
};

// ##############################################################
// DEFINE FUNCTION TO RETRIEVE LEADERBOARD DATA
// ##############################################################
/*
  This function retrieves a leaderboard displaying all available abilities and their levels.
  It queries the Ability table and sorts the results by level (highest first),
  followed by character name in alphabetical order.
  The function does not include user-specific data, as abilities may not yet be unlocked.
*/

module.exports.getLeaderboard = (callback) => {
  const SQLSTATMENT = `
SELECT 
  character_name,  
  ability_name,    
  level           
FROM Ability
WHERE character_name IS NOT NULL
ORDER BY level DESC, character_name ASC;

    `;

  pool.query(SQLSTATMENT, callback);
};

