const pool = require('../services/db');

// Selects all challenges and associated reviews from the FitnessChallenge and Reviews tables.
module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
            SELECT 
                Reviews.user_id AS user_id,
                Fitnesschallenge.challenge AS challenge,
                Reviews.review_amt AS review_amt,
                Reviews.challenge_id AS challenge_id
            FROM Reviews
            JOIN Fitnesschallenge 
                ON Fitnesschallenge.challenge_id = Reviews.challenge_id
        `;
    
        // Executes the SQL statement and returns results via callback.
        pool.query(SQLSTATMENT, callback);
    }
    
    // Selects all reviews associated with a specific challenge ID.
    module.exports.selectById = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM Reviews
        WHERE challenge_id = ?;
        `;
        const VALUES = [data.challenge_id];
    
        // Executes the SQL statement with the provided challenge ID.
        pool.query(SQLSTATMENT, VALUES, callback);
    }
    
    // Selects all reviews associated with a specific user ID and the related challenge details.
    module.exports.selectByUserId = (data, callback) => {
        const SQL_STATEMENT = `
            SELECT 
                Reviews.user_id AS user_id,
                Fitnesschallenge.challenge AS challenge,
                Reviews.review_amt AS review_amt,
                Reviews.challenge_id AS challenge_id,
                Reviews.id AS id
            FROM Reviews
            JOIN Fitnesschallenge 
                ON Fitnesschallenge.challenge_id = Reviews.challenge_id
            WHERE Reviews.user_id = ?;
        `;
    
        const VALUES = [data.user_id];
    
        // Executes the SQL statement with the provided user ID.
        pool.query(SQL_STATEMENT, VALUES, callback);
    }
    
    // Inserts a new review for a specific user and challenge.
    module.exports.insertSingle = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO Reviews (review_amt, user_id, challenge_id)
        VALUES (?, ?, ?);
        `;
        const VALUES = [data.review_amt, data.user_id, data.challenge_id];
    
        // Executes the SQL statement to insert a new review.
        pool.query(SQLSTATMENT, VALUES, callback);
    }
    
    // Updates an existing review based on the review's ID.
    module.exports.updateById = (data, callback) =>
    {
        const SQLSTATMENT = `
        UPDATE Reviews 
        SET review_amt = ?, user_id = ?
        WHERE id = ?;
        `;
        const VALUES = [data.review_amt, data.user_id, data.id];
    
        // Executes the SQL statement to update the review data.
        pool.query(SQLSTATMENT, VALUES, callback);
    }
    
    // Deletes a review based on the review's ID.
    module.exports.deleteById = (data, callback) => {
        const SQLSTATMENT = `
        DELETE FROM Reviews 
        WHERE id = ?;
        `;
        const VALUES = [data.id];
    
        // Executes the SQL statement to delete the review.
        pool.query(SQLSTATMENT, VALUES, callback);
    };