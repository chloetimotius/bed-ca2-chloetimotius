document.addEventListener("DOMContentLoaded", function () {
  // Get the token from local storage to check if the user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to access");
    window.location.href = "login.html"; // Redirect to login page if no token found
    return;
  }

  // Get the reference to the challenge list container
  const challengeList = document.getElementById("challengeList");

  // Callback function to handle the response when challenges are fetched
  const callback = (responseStatus, responseData) => {
    console.log("responseStatus:", responseStatus);
    console.log("responseData:", responseData);

    // Iterate over each challenge in the response data
    responseData.forEach((challenge) => {
      const challengeId = parseInt(challenge.challenge_id, 10); // Ensure challenge_id is a number
      const displayItem = document.createElement("div"); // Create a div element to display challenge
      displayItem.className = "col-lg-3 col-md-6 col-sm-12 p-3"; // Add responsive classes for the grid
      displayItem.id = `challenge-${challengeId}`; // Set the id for the challenge container
      displayItem.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${challenge.challenge}</h5>
            <p class="card-text">
              <strong>Skillpoints:</strong> ${challenge.skillpoints} <br>
              <strong>Challenge ID:</strong> ${challengeId} <br>
              <strong>Creator ID:</strong> ${challenge.creator_id}
            </p>
            <textarea id="notes-${challengeId}" placeholder="Add your notes here" class="form-control" rows="3" style="display:none;"></textarea><br>
            <button class="btn btn-warning btn-sm complete-btn" data-challenge-id="${challengeId}">
              Complete
            </button>
            <button class="btn btn-success btn-sm submit-notes-btn" data-challenge-id="${challengeId}" style="display:none;">
              Submit Notes
            </button>
            <div id="completed-records-${challengeId}" class="mt-3 completed-records"></div>
          </div>
        </div>
      `;
      challengeList.appendChild(displayItem); // Append the created challenge item to the challenge list

      fetchCompletedRecords(challengeId); // Fetch and display completed records for the challenge

      // If the challenge is completed, disable the "Complete" button
      if (challenge.completed) {
        const button = displayItem.querySelector(".complete-btn");
        button.textContent = "Completed";
        button.disabled = true;
      }
    });

    // Add event listeners to all the "Complete" buttons for completing the challenge
    document.querySelectorAll(".complete-btn").forEach(button => {
      button.addEventListener("click", function () {
        const challengeId = parseInt(button.getAttribute("data-challenge-id"), 10); // Get challenge ID from button

        // Display the textarea for notes and the "Submit Notes" button
        const notesTextarea = document.getElementById(`notes-${challengeId}`);
        const submitNotesButton = document.querySelector(`.submit-notes-btn[data-challenge-id="${challengeId}"]`);
        
        if (notesTextarea) {
          notesTextarea.style.display = "block"; // Show the notes textarea
        }

        button.style.display = "none"; // Hide the "Complete" button
        if (submitNotesButton) {
          submitNotesButton.style.display = "inline-block"; // Show the "Submit Notes" button
        }

        // Add event listener to the "Submit Notes" button to submit notes for the challenge
        submitNotesButton.addEventListener("click", function submitNotes() {
          const notes = notesTextarea.value.trim(); // Get and trim the notes input
          if (!notes) {
            alert("Please add your notes before submitting.");
            return; // Ensure notes are added before submitting
          }
        
          const userId = localStorage.getItem("user_id"); // Get user ID from local storage
          const data = {
            challenge_id: challengeId,
            user_id: userId,
            completed: true,
            notes: notes,
            creation_date: new Date()
          };
        
          // Callback function for completing the challenge and submitting notes
          const completeChallengeCallback = (responseStatus, responseData) => {
            if (responseStatus === 201) {
              alert("Challenge completed successfully!"); // Success message on completion
        
              const skillpoints = responseData.skill_points_awarded;
              if (skillpoints !== undefined && skillpoints !== null) {
                alert(`You earned ${skillpoints} skill points!`); // Notify user about earned skill points
              } else {
                alert("Error: Skill points not returned by server.");
              }
        
              // Reload the page after challenge completion
              location.reload();
        
              submitNotesButton.textContent = "Completed"; // Change the button text to "Completed"
              submitNotesButton.removeEventListener("click", submitNotes); // Remove the event listener after submission
            } else {
              alert("Error: " + responseData.message); // Show error message if challenge completion fails
            }
          };
        
          fetchMethod(currentUrl + `/api/challenges/` + challengeId, completeChallengeCallback, "POST", data); // Submit the completion data
        });        
      });
    });
  };

  // Fetch the completed records for a specific challenge
  const fetchCompletedRecords = (challengeId) => {
    fetchMethod(`${currentUrl}/api/challenges/${challengeId}`, (responseStatus, responseData) => {
      const completedRecordsContainer = document.getElementById(`completed-records-${challengeId}`);
      if (responseStatus === 200 && responseData.length > 0) {
        // If records are found, display them
        responseData.forEach(record => {
          const recordItem = document.createElement("div");
          recordItem.className = "completed-record card p-3 mb-3";
          recordItem.innerHTML = `
            <div class="record-header">
              <p><strong>User ID:</strong> ${record.user_id}</p>
              <p><strong>Completion Date:</strong> ${new Date(record.creation_date).toLocaleString()}</p>
            </div>
            <div class="record-body">
              <p><strong>Notes:</strong> ${record.notes}</p>
            </div>
          `;
          completedRecordsContainer.appendChild(recordItem); // Append the record item to the container
        });
      } else {
        // If no completed records are found, show a message
        completedRecordsContainer.innerHTML = "<p>No completed records found.</p>";
      }
    });
  };

  // Fetch and display all challenges
  fetchMethod(currentUrl + "/api/challenges", callback);
});
