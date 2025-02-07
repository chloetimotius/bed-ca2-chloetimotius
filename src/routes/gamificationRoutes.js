// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');
const router = express.Router();

// ##############################################################
// CREATE ROUTER
// ##############################################################
const controller = require('../controllers/gamificationController');

// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.get('/user-abilities', controller.readAllCharactersAbilities); // GET request to retrieve all characters abilities
router.post('/level-up', controller.levelUpCharacter); // POST request to level up a character with skill points
router.get('/leaderboard', controller.readLeaderboard); // GET request to retrieve characters by level by leaderboard
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;