// ##############################################################
// CONTROLLER FUNCTION TO CREATE A REVIEW
// ##############################################################
/*
  This function handles the HTTP request to create a new review for a specific challenge.
  It validates the input data, checks if the review amount is between 1 and 5, 
  and ensures that the user ID is provided.
*/
const model = require("../models/reviewModel.js");

module.exports.createReview = (req, res, next) => {
    // Validate that 'review_amt' is provided and within the correct range
    if(req.body.review_amt == undefined) {
        res.status(400).send("Error: review_amt is undefined");
        return;
    } else if(req.body.review_amt > 5 || req.body.review_amt < 1) {
        res.status(400).send("Error: review_amt can only be between 1 to 5");
        return;
    }
    // Validate that 'user_id' is provided
    else if(req.body.user_id == undefined) {
        res.status(400).send("Error: user_id is undefined");
        return;
    }

    // Prepare data object for insertion into the database
    const data = {
        user_id: req.body.user_id,
        review_amt: req.body.review_amt,
        challenge_id: req.params.challenge_id
    }

    console.log("data", data);

    // Callback to handle the result of the insert operation
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createMessage:", error);
            res.status(500).json(error);  // Send a 500 error if something goes wrong
        } else {
            res.status(201).json({
                user_id: data.user_id,
                review_amt: data.review_amt,
                challenge_id: data.challenge_id
            });  // Send a success response with the created data
        }
    }

    // Insert the review data into the database
    model.insertSingle(data, callback);
}

// ##############################################################
// CONTROLLER FUNCTION TO RETRIEVE REVIEW BY ID
// ##############################################################
/*
  This function handles the HTTP request to retrieve a review for a specific challenge 
  based on the challenge ID passed in the URL.
*/
module.exports.readReviewById = (req, res, next) => {
    // Prepare the data object containing the challenge_id
    const data = {
        challenge_id: req.params.challenge_id
    }

    // Callback to handle the result of the select operation
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readReviewById:", error);
            res.status(500).json(error);  // Send a 500 error if something goes wrong
        } else {
            if(results.length == 0) {
                res.status(404).json({
                    message: "Review not found"
                });  // Send 404 if no review is found
            } else {
                res.status(200).json(results[0]);  // Return the found review data
            }
        }
    }

    // Retrieve the review data from the database
    model.selectById(data, callback);
}

// ##############################################################
// CONTROLLER FUNCTION TO RETRIEVE REVIEWS BY USER ID
// ##############################################################
/*
  This function handles the HTTP request to retrieve all reviews created by a specific user.
  It uses the user ID passed in the URL to fetch reviews from the database.
*/
module.exports.readReviewByUserId = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readReviewById:", error);
            res.status(500).json(error);  // Send a 500 error if something goes wrong
        } else {
            if(results.length == 0) {
                res.status(404).json({
                    message: "Review not found"
                });  // Send 404 if no reviews are found
            } else {
                res.status(200).json(results);  // Return the found reviews
            }
        }
    }

    // Retrieve reviews by user ID from the database
    model.selectByUserId(data, callback);
}

// ##############################################################
// CONTROLLER FUNCTION TO RETRIEVE ALL REVIEWS
// ##############################################################
/*
  This function handles the HTTP request to retrieve all reviews in the database.
  It does not filter by user or challenge ID.
*/
module.exports.readAllReview = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllReview:", error);
            res.status(500).json(error);  // Send a 500 error if something goes wrong
        } else {
            res.status(200).json(results);  // Return all reviews
        }
    }

    // Retrieve all reviews from the database
    model.selectAll(callback);
}

// ##############################################################
// CONTROLLER FUNCTION TO UPDATE A REVIEW
// ##############################################################
/*
  This function handles the HTTP request to update an existing review by its ID.
  It validates the input data, including review amount and user ID.
*/
module.exports.updateReviewById = (req, res, next) => {
    const reviewId = req.params.id;
    const { review_amt, user_id } = req.body;

    console.log('Incoming data:', req.body);  // Log the entire request body to check what's being received

    // Validate that the review ID, review amount, and user ID are provided
    if (!reviewId) {
        return res.status(400).send("Error: ID is required");
    }
    if (review_amt === undefined) {
        return res.status(400).send("Error: review_amt is required");
    }
    if (review_amt < 1 || review_amt > 5) {
        return res.status(400).send("Error: review_amt must be between 1 and 5");
    }
    if (!user_id) {
        return res.status(400).send("Error: user_id is required");
    }

    // Prepare the data object for updating the review
    const data = {
        id: reviewId,
        user_id: user_id,
        review_amt: review_amt
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error in updateReviewById:", error);
            return res.status(500).json(error);  // Send a 500 error if something goes wrong
        }
        res.status(204).send();  // Send no content (204) to indicate successful update
    };

    // Update the review in the database
    model.updateById(data, callback);
};

// ##############################################################
// CONTROLLER FUNCTION TO DELETE A REVIEW
// ##############################################################
/*
  This function handles the HTTP request to delete a review by its ID.
  If the review is not found, it returns a 404 status code.
*/
module.exports.deleteReviewById = (req, res, next) => {
    const data = {
        id: req.params.id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteReviewById:", error);
            return res.status(500).json({
                message: "Internal server error, please try again later.",
                error: error
            });  // Send a 500 error if something goes wrong
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Review not found"
            });  // Send 404 if the review was not found
        }

        // Send success response with status 204 (No Content)
        return res.status(204).send();  // No content is returned
    };

    // Delete the review from the database
    model.deleteById(data, callback);
};
