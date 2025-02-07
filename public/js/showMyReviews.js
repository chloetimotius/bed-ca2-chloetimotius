document.addEventListener("DOMContentLoaded", function () {
    // Get user_id and token from local storage
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");

    // Check if the token exists in local storage
    if (!token) {
        alert("Please login to access");
        window.location.href = "login.html"; // Redirect to login page if no token is found
        return;
    }

    console.log("Fetching reviews for user ID:", userId);  // Debugging line to check user ID

    // Function to handle API response for reviews
    const handleApiResponse = (data) => {
        console.log("Response Data:", data); // Debugging line to inspect data

        const reviewContainer = document.getElementById("myreviewList");

        // Ensure the review container exists in the DOM
        if (!reviewContainer) {
            console.error('Review container not found in the DOM.');
            return;
        }

        // If reviews are found, render them to the page
        if (data && Array.isArray(data) && data.length > 0) {
            data.forEach((review) => {
                console.log("Rendering review:", review);  // Debugging line to inspect each review
                const reviewItem = document.createElement("div");
                reviewItem.className = "col-12 col-md-4 col-lg-3 my-3";  // Bootstrap grid for responsive layout

                reviewItem.innerHTML = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${review.challenge}</h5>
                            <div class="rating">${generateStarRating(review.review_amt)}</div>
                            <p class="card-text">                         
                               User ID: ${review.user_id}<br>
                               Challenge ID: ${review.challenge_id}<br>
                            </p>
                            <button class="btn btn-warning btn-sm" onclick="editReview(${review.id}, ${review.review_amt})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteReview(${review.id})">Delete</button>
                        </div>
                    </div>
                `;
                reviewContainer.appendChild(reviewItem);
            });
        } else {
            reviewContainer.innerHTML = "<p>No reviews found for this user.</p>"; // If no reviews exist, show a message
        }
    };

    // Fetch reviews using the API route for the specific user
    fetchReviewsByUserId(userId, handleApiResponse);
});

// Function to fetch reviews for a specific user from the API
function fetchReviewsByUserId(userId, callback) {
    fetch(`${currentUrl}/api/review/user/${userId}`)
        .then(response => {
            console.log("Received response:", response);  // Debugging line to inspect the response
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);  // Handle HTTP errors
            }
            return response.json(); // Parse JSON if response is successful
        })
        .then(data => {
            callback(data);  // Pass only the data to the callback function
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);  // Log errors if any occur during fetch
        });
}

// Function to generate star rating based on review score (1 to 5)
function generateStarRating(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);  // Generate filled and unfilled stars based on the rating
}

// Function to edit a review when the "Edit" button is clicked
function editReview(reviewId, currentRating) {
    const newRating = prompt("Enter new rating (1-5):", currentRating); // Prompt user for a new rating
    if (newRating && newRating >= 1 && newRating <= 5) {
        updateReview(reviewId, newRating);  // If valid rating, trigger review update
    } else {
        alert("Invalid rating. Please enter a number between 1 and 5.");  // Alert if the rating is invalid
    }
}

// Function to update the review when the rating is changed
async function updateReview(reviewId, newRating) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to update a review.");
        window.location.href = "login.html"; // Redirect to login page if token is not found
        return;
    }

    const user_id = localStorage.getItem("user_id");  // Get user ID from local storage

    if (!user_id) {
        alert("User ID is required.");
        return;
    }

    console.log('Review ID:', reviewId);
    console.log('New Rating:', newRating);
    console.log('User ID:', user_id);  // Log the user_id to check its value

    try {
        const response = await fetch(`${currentUrl}/api/review/${reviewId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ review_amt: newRating, user_id: user_id }) // Update review with new rating
        });

        const text = await response.text();  // Read the response body as text
        console.log("Response status:", response.status);  // Log status code
        console.log("Response body:", text);  // Log the raw response body

        if (response.status === 204) {
            alert("Review updated successfully");  // Alert user on successful update
            location.reload();  // Reload the page to reflect the changes
        } else {
            alert("Failed to update review: " + text);  // Alert on failure to update
        }
    } catch (error) {
        console.error("Error updating review:", error);  // Log error if update fails
    }
}

// Function to delete a review by clicking the "Delete" button
async function deleteReview(reviewId) {
    if (!confirm("Are you sure you want to delete this review?")) return;  // Confirm before deleting

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${currentUrl}/api/review/${reviewId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        // Handle the response status
        if (response.status === 204) {
            alert("Review deleted successfully");
            location.reload();  // Reload the page to fetch updated data
        } else if (response.status === 404) {
            alert("Review not found");  // Alert if review not found
        } else {
            const responseBody = await response.text();
            alert(`Failed to delete review: ${responseBody}`);  // Alert on deletion failure
        }
    } catch (error) {
        console.error("Error deleting review:", error);  // Log error if deletion fails
        alert("An error occurred while deleting the review.");  // Display error message
    }
}
