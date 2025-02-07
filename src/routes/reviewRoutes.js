// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');
const router = express.Router();

// ##############################################################
// CREATE ROUTER
// ##############################################################
const controller = require('../controllers/reviewController');

// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.get('/', controller.readAllReview); // GET request to retrieve all reviews
router.post('/:challenge_id/submitReview', controller.createReview); // POST request to submit a new review for a specific challenge
router.get('/challenge/:challenge_id', controller.readReviewById); // GET request to retrieve reviews for a specific challenge
router.get('/user/:user_id', controller.readReviewByUserId); // GET request to retrieve reviews by a specific user
router.put('/:id', controller.updateReviewById); // PUT request to update a review by its ID
router.delete('/:id', controller.deleteReviewById); // DELETE request to delete a review by its ID

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
