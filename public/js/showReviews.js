document.addEventListener("DOMContentLoaded", function () {

    // Function to handle the API response and display the reviews
    const handleResponse = (status, data) => {
        console.log("Response Status:", status);  // Log the response status
        console.log("Response Data:", data);  // Log the response data
  
        const challengeReviews = document.getElementById("reviewList");  // Get the review list container
  
        // Check if there are reviews in the response data
        if (data && data.length > 0) {
            data.forEach((review) => {
                const displayItem = document.createElement("div");  // Create a new div element for each review
                displayItem.className = "col-lg-3 col-md-6 col-sm-12 pb-3";  // Apply Bootstrap grid classes
  
                // Set the inner HTML with review details
                displayItem.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                           <h5 class="card-title">${review.challenge}</h5>  
                            <div class="star-rating">${getStarRating(review.review_amt)}</div>  
                            <p class="card-text">
                            User ID: ${review.user_id}<br>  
                            Challenge ID: ${review.challenge_id}  
                            </p>
                        </div>
                    </div>
                `;
                challengeReviews.appendChild(displayItem);  // Append the review to the container
            });
        } else {
            challengeReviews.innerHTML = "<p>No reviews yet for this challenge.</p>";  // If no reviews, display a message
        }
    };
  
    // Fetch reviews using the corrected API route
    fetchMethod(`${currentUrl}/api/review/`, handleResponse);  // Fetch reviews from the API
  
  });
  
  // Function to generate star ratings based on the review score
  function getStarRating(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);  // Create star rating using ★ for the rating and ☆ for the remaining
  }
  