// ##############################################################
// REQUIRE MODULES
// ##############################################################
// Import the challenges model to interact with the database
const challengesModel = require("../models/challengesModel");

// ##############################################################
// DEFINE CONTROLLER FUNCTION TO CREATE CHALLENGE
// ##############################################################
/*
 - Controller to create a new challenge.
 - Validates the request body and inserts a new challenge into the database.
 */
module.exports.createNewChallenge = (req,res, next) => {
        //Validate request body
        if(req.body.challenge == undefined || req.body.user_id == undefined || req.body.skillpoints == undefined)
        {
            return res.status(400).json({ 
                "message": "Missing challenge/user_id/skillpoints." 
            });
        }

        //Prepare the data to be inserted
        const data = {
            creator_id: req.body.user_id,
            challenge: req.body.challenge,
            skillpoints: req.body.skillpoints
        };

        //Callback function for database operation
        // Callback function for database operation
const callback = (error, results, fields) => {
    if (error) {
        console.error("Internal server error", error);
        return res.status(500).json({
            "message": "Internal server error",
            "error": error
        });
    } else {
        // Log the insertId to confirm the new challenge has been created
        console.log("Challenge successfully created with ID:", results.insertId);
        
        // Respond with the created challenge details
        return res.status(201).json({
            "challenge_id": results.insertId,  // The ID generated by MySQL
            "challenge": data.challenge,
            "creator_id": data.creator_id,
            "skillpoints": data.skillpoints
        });
    }
};

        
        //Call the model to create a new challenge
        challengesModel.createChallenge(data, callback);
    };

// ##############################################################
// DEFINE CONTROLLER FUNCTION TO READ ALL CHALLENGES
// ##############################################################
/*
 - Controller to fetch all challenges from the database.
 */
module.exports.readAllChallenge = (req, res, next) => {
        //Callback function to handle query results
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error readAllPlayer:", error);
                res.status(500).json(error);
            } else { 
                //Respond with the list of challenges
                res.status(200).json(results);
            }
        };
    
        //Call the model to retrieve all challenges
        challengesModel.selectAll(callback);
    };
// ##############################################################
// Middleware: Check if the user is the creator of the challenge
// ##############################################################
/*
 - Middleware to verify if the logged-in user is the creator of the challenge.
 * NOT USED-------------------------------------/
module.exports.checkChallengeOwnership = (req, res, next) => {
    const challenge_id = req.params.challenge_id; // Get challenge ID from URL
    const user_id = req.body.user_id; // Get user ID from request body

    // Ensure the required fields are present in the request body
    if (req.body.challenge === undefined || req.body.user_id === undefined || req.body.skillpoints === undefined) {
        return res.status(400).json({
            "message": "Missing challenge/user_id/skillpoints."
        });
    }

    // Query to check challenge ownership
    challengesModel.getChallengeById(challenge_id, (error, results) => {
        if (error) {
            console.error("Internal server error", error);
            return res.status(500).json({
                "message": "Internal server error",
                "error": error
            });
        }

        // If no challenge found, return 404 status
        if (results.length === 0) {
            return res.status(404).json({
                "message": "Challenge not found."
            });
        }

        const existingChallenge = results[0];

        // Check if the logged-in user is the creator of the challenge
        if (existingChallenge.creator_id !== user_id) {
            return res.status(403).json({
                "message": "You are not the creator of this challenge."
            });
        }

        // If the user is the creator, proceed to the next controller to update challenge by id
        next();
    });
};

// ##############################################################
// DEFINE CONTROLLER FUNCTION TO UPDATE CHALLENGE BY ID
// ##############################################################
/*
 - Controller to update an existing challenge by ID.
 */
 module.exports.updateChallengeById = (req, res, next) => {
    console.log("Received request to update challenge:", req.params.challenge_id);
    console.log("Request body:", req.body);

    const challenge_id = req.params.challenge_id;
    const data = {
        challenge_id: challenge_id,
        creator_id: req.body.user_id,
        challenge: req.body.challenge,
        skillpoints: req.body.skillpoints
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Internal server error", error);
            return res.status(500).json({
                "message": "Internal server error",
                "error": error
            });
        }

        if (results.affectedRows === 0) {
            console.log("Challenge not found in database:", challenge_id);
            return res.status(404).json({
                "message": "Requested challenge_id does not exist."
            });
        }

        console.log("Challenge updated successfully:", data);
        return res.status(200).json(data);
    };

    console.log("Calling updateById function...");
    challengesModel.updateById(data, callback);
};


// ##############################################################
// DEFINE CONTROLLER FUNCTION FOR DELETE CHALLENGE BY ID
// ##############################################################
/*
 - Controller to delete a challenge by ID.
 */
module.exports.deleteChallengeById = (req, res, next) => {
        const data = {
            challenge_id: req.params.challenge_id // Get challenge ID from URL
        };
    
        //Callback for database delete operation
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error deletePlayerById:", error);
                res.status(500).json(error);
            } else {
                //If no rows were deleted, return 404 status
                if (results.affectedRows == 0) {
                    res.status(404).json({
                        message: "Challenge not found"
                    });
                } else {
                    //Respond with no content
                    res.status(204).send(); // 204 No Content            
                }
            }
        };
    
        // Call the model to delete the challenge
        challengesModel.deleteById(data, callback);
    };

// ##############################################################
// DEFINE CONTROLLER FUNCTION TO CREATE CHALLENGE COMPLETION RECORD
// ##############################################################
/*
 - Middleware to check if the challenge and user exist.
 - If both exist, proceed to create a completion record.
 */
module.exports.checkChallengeAndUserExistence = (req, res, next) => {
    const challenge_id = req.params.challenge_id;  // Get challenge ID from URL
    const user_id = req.body.user_id;  // Get user ID from request body

    // Query to check if challenge_id exists and if user_id exists
    challengesModel.getChallengeById(challenge_id, (error, challengeResults) => {
        if (error) {
            console.error("Error checking challenge existence:", error);
            return res.status(500).json({ message: "Database error checking challenge." });
        }

        // If the challenge doesn't exist, return 404 status
        if (challengeResults.length === 0) {
            return res.status(404).json({
                "message": "Challenge not found."
            });
        }

        // Check if user exists in the database
        challengesModel.getUserById(user_id, (error, userResults) => {
            if (error) {
                console.error("Error checking user existence:", error);
                return res.status(500).json({ message: "Database error checking user." });
            }

            // If the user doesn't exist, return 404 status
            if (userResults.length === 0) {
                return res.status(404).json({
                    "message": "User not found."
                });
            }

            // If both the challenge and user exist, proceed to next controller to create the completion record
            next();
        });
    });
};

/*
 - Controller to create a new completion record.
 */
 module.exports.createNewRecord = (req, res, next) => {
    // Validates the request body
    if (req.body.creation_date == undefined) {
        return res.status(400).json({ 
            "message": "Missing creation_date." 
        });
    }

    const challenge_id = req.params.challenge_id;  // Get challenge ID from URL
    
    // Convert creation_date to MySQL datetime format
    const creation_date = new Date(req.body.creation_date);
    const formattedCreationDate = creation_date.toISOString().slice(0, 19).replace('T', ' ');  // Convert to 'YYYY-MM-DD HH:MM:SS'

    const data = {
        user_id: req.body.user_id,
        challenge_id: challenge_id,
        completed: req.body.completed,
        creation_date: formattedCreationDate,  // Use formatted date here
        notes: req.body.notes || null  // If notes are not provided, default to null
    };

    // Callback for completion record creation
    const callback = (error, results) => {
        if (error) {
            console.error("Error creating completion record:", error);
            return res.status(500).json({ message: "Error creating completion record." });
        }

        // Award skill points based on challenge completion status
        let skillPointsAwarded = 0;

        if (data.completed) {
            // If challenge completed, fetch the skill points from FitnessChallenge table
            challengesModel.getSkillPointsForChallenge(data.challenge_id, (err, challengeResults) => {
                if (err) {
                    console.error("Error fetching challenge skill points:", err);
                    return res.status(500).json({ message: "Error fetching challenge skill points." });
                }

                if (challengeResults.length > 0) {
                    skillPointsAwarded = challengeResults[0].skillpoints;
                }

                // Update the user's skill points
                challengesModel.updateUserSkillPoints(data.user_id, skillPointsAwarded, (updateError, updateResults) => {
                    if (updateError) {
                        console.error("Error updating user skill points:", updateError);
                        return res.status(500).json({ message: "Error updating user skill points." });
                    }

                    // Respond with the inserted record and awarded skill points
                    res.status(201).json({ 
                        "complete_id": results.insertId,  // The ID generated by MySQL
                        "challenge_id": challenge_id,
                        "user_id": data.user_id,
                        "completed": data.completed,
                        "creation_date": data.creation_date,
                        "notes": data.notes,
                        "skill_points_awarded": skillPointsAwarded
                    });
                });
            });
        } else {
            // If challenge was not completed, award 5 skill points
            skillPointsAwarded = 5;

            // Update the user's skill points
            challengesModel.updateUserSkillPoints(data.user_id, skillPointsAwarded, (updateError, updateResults) => {
                if (updateError) {
                    console.error("Error updating user skill points:", updateError);
                    return res.status(500).json({ message: "Error updating user skill points." });
                }

                // Respond with the inserted record and awarded skill points
                res.status(201).json({ 
                    "complete_id": results.insertId,  // The ID generated by MySQL
                    "challenge_id": challenge_id,
                    "user_id": data.user_id,
                    "completed": data.completed,
                    "creation_date": data.creation_date,
                    "notes": data.notes,
                    "skill_points_awarded": skillPointsAwarded
                });
            });
        }
    };

    // Call the model to create the challenge record
    challengesModel.createRecord(data, callback);
};
// ##############################################################
// DEFINE CONTROLLER FUNCTION TO READ USER RECORDS BY CHALLENGE ID
// ##############################################################
/*
 - Controller to delete get users record by ID.
 */
module.exports.readUserByChallengeId = (req, res, next) => {
    const challenge_id = req.params.challenge_id;  // Get challenge ID from URL

    // Callback to handle query results and send appropriate response
    const callback = (error, results) => {
        if (error) {
            // If there is an error while fetching the challenge participants, log it and respond with an error
            console.error("Error fetching challenge participants:", error);
            return res.status(500).json({ "message": "Error fetching challenge participants." });
        }

        // If no participants found, return 404 status
        if (results.length === 0) {
            return res.status(404).json({ "message": "No participants found for this challenge." });
        }

        // If participants are found, return the list of users who participated in the challenge
        res.status(200).json(results);
    };

    // Call the model to get all participants who attempted the challenge
    challengesModel.selectByChallengeId(challenge_id, callback);
};