document.addEventListener("DOMContentLoaded", function () {
    // Get references to DOM elements
    const challengeList = document.getElementById("addReview");
    const challengeDetails = document.getElementById("challenge");

    // Get the challenge ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const challenge_id = urlParams.get("challenge_id");

    // Fetch and display the list of challenges
    fetchMethod(currentUrl + "/api/challenges", (responseStatus, responseData) => {
        console.log("Challenges Response:", responseStatus, responseData);

        // Loop through the fetched challenge data and display each challenge in the list
        responseData.forEach((challenge) => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-lg-3 col-md-6 col-sm-12 p-3"; // Set grid classes for responsiveness
            displayItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${challenge.challenge}</h5>
                        <p class="card-text">
                            <strong>Skillpoints:</strong> ${challenge.skillpoints} <br>
                            <strong>Challenge ID:</strong> ${challenge.challenge_id} <br>
                            <strong>Creator ID:</strong> ${challenge.creator_id} 
                        </p>
                        <a href="sendReview.html?challenge_id=${challenge.challenge_id}" class="btn btn-warning btn-sm">Add review</a>
                    </div>
                </div>
            `;
            challengeList.appendChild(displayItem); // Append the challenge item to the list
        });
    });

    // Check if we are on the review page and the challenge_id is present
    if (challengeDetails && challenge_id) {
        fetchMethod(currentUrl + `/api/challenges/${challenge_id}`, (responseStatus, responseData) => {
            console.log("Challenge Details Response:", responseStatus, responseData);

            // Loop through the response and display challenge details
            responseData.forEach((challenges) => {
                const displayItem = document.createElement("div");
                displayItem.innerHTML = `<h4 class="text-center">${challenges.challenge}</h4><br>`;
                challengeDetails.appendChild(displayItem); // Append the challenge title to the challenge details section
            });
        });
    }

    // Handle star rating selection
    const stars = document.querySelectorAll("#starRating .fa-star");
    let selectedRating = 0; // Initialize the selected rating variable

    // Add event listeners to each star to update the rating when clicked
    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = star.getAttribute("data-value"); // Get the rating value of the clicked star
            stars.forEach(s => s.classList.remove("checked")); // Remove "checked" class from all stars
            for (let i = 0; i < selectedRating; i++) { 
                stars[i].classList.add("checked"); // Add "checked" class to selected stars
            }
        });
    });

    // Handle the review submission process when the submit button is clicked
    const submitButton = document.getElementById("submitReview");
    if (submitButton) {
        submitButton.addEventListener("click", () => {
            if (selectedRating > 0) { // Ensure a rating is selected
                const user_id = localStorage.getItem("user_id"); // Get the user ID from local storage

                if (!user_id) {
                    alert("You must be logged in to submit a review.");
                    window.location.href = "login.html"; // Redirect to login page if the user is not logged in
                    return;
                }

                if (!challenge_id) {
                    alert("Invalid challenge. Please try again.");
                    return; // Ensure challenge_id is valid
                }

                // Prepare the request data with the selected rating and user ID
                const requestData = {
                    review_amt: selectedRating,
                    user_id: user_id,
                };

                // Send the review data to the server
                fetch(currentUrl + `/api/review/${challenge_id}/submitReview`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestData),
                })
                .then(response => {
                    console.log("Response Status:", response.status);
                    if (!response.ok) {
                        throw new Error("Failed to submit review. Please try again.");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Rating submitted successfully:", data);
                    window.location.href = "editReview.html"; // Redirect to edit review page upon successful submission
                })
                .catch(error => {
                    console.error("Error submitting rating:", error); // Log any error that occurs during the review submission
                });
            } else {
                alert("Please select a rating before submitting."); // Alert if no rating is selected
            }
        });
    }
});
