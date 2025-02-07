// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');
const router = express.Router();

// ##############################################################
// CREATE ROUTER
// ##############################################################
const controller = require('../controllers/challengesController');

// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.get('/', controller.readAllChallenge); // GET request to retrieve all challenges
router.post('/', controller.createNewChallenge); // POST request to create a new challenge
router.post('/:challenge_id', controller.checkChallengeAndUserExistence, controller.createNewRecord); // POST request to create a new challenge
router.get('/:challenge_id', controller.readUserByChallengeId); // GET request to retrieve a user by ID
router.put('/:challenge_id',  controller.updateChallengeById); // PUT request to update a challenge by ID
router.delete('/:challenge_id', controller.deleteChallengeById); // DELETE request to delete a tree by ID

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;