// Global variable for filtered challenges
let filteredChallenges = [];

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    userId = localStorage.getItem("user_id");

    // Check if user is logged in
    if (!token) {
        alert("Please login to access");
        window.location.href = "login.html";
        return;
    }

    // Handle the challenge creation form submission
    document.getElementById('createChallengeForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const challengeDescription = document.getElementById('challengeDescription').value;
        const skillpoints = document.getElementById('skillpoints').value;

        const challengeData = {
            user_id: userId,
            challenge: challengeDescription,
            skillpoints: skillpoints
        };

        fetch('/api/challenges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(challengeData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.challenge_id) {
                alert('Challenge created successfully!');
                loadChallenges();  // Reload challenges
            } else {
                alert('Error creating challenge');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred');
        });
    });

    // Load challenges on page load
    loadChallenges();
});

// Function to load challenges created by the user
function loadChallenges() {
    fetch('/api/challenges')
        .then(response => response.json())
        .then(data => {
            const challengeList = document.getElementById('challengeList');
            challengeList.innerHTML = '';  // Clear previous challenges

            console.log("Challenges data:", data);  // Check the data

            // Convert userId to an integer to match the type of creator_id
            const userIdInt = parseInt(userId, 10);
            console.log("User ID as Integer:", userIdInt);

            filteredChallenges = data.filter(challenge => {
                return challenge.creator_id === userIdInt;  // Compare as numbers
            });

            // Display challenges
            if (filteredChallenges.length > 0) {
                filteredChallenges.forEach(challenge => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item');
                    li.innerHTML = `
                        ${challenge.challenge} - Skill Points: ${challenge.skillpoints}
                        <button class="btn btn-warning btn-sm ms-2" data-action="edit" data-id="${challenge.challenge_id}" data-description="${challenge.challenge}" data-skillpoints="${challenge.skillpoints}">Edit</button>
                        <button class="btn btn-danger btn-sm ms-2" data-action="delete" data-id="${challenge.challenge_id}">Delete</button>
                    `;
                    challengeList.appendChild(li);
                });
            } else {
                challengeList.innerHTML = '<li class="list-group-item">No challenges found.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching challenges:', error);
            alert('Error fetching challenges');
        });
}

// Delegate events to handle edit and delete actions
document.getElementById('challengeList').addEventListener('click', function(event) {
    const target = event.target;
    
    if (target && target.tagName === 'BUTTON') {
        const action = target.getAttribute('data-action');
        const challengeId = target.getAttribute('data-id');
        
        console.log("Challenge ID from button:", challengeId);  // Log the button's challengeId
        
        // Find the challenge object from filteredChallenges using the challenge_id
        const challenge = filteredChallenges.find(ch => ch.challenge_id === parseInt(challengeId, 10));  // Ensure comparison is between numbers

        console.log("Found challenge:", challenge);  // Log the found challenge

        if (action === 'edit' && challenge) {
            const description = challenge.challenge;
            const skillpoints = challenge.skillpoints;
            editChallenge(challengeId, description, skillpoints);
        } else if (action === 'delete' && challenge) {
            deleteChallenge(challengeId);
        } else {
            console.log("Challenge not found or action is invalid.");
        }
    }
});

// Function to handle challenge deletion
function deleteChallenge(challengeId) {
    if (confirm('Are you sure you want to delete this challenge?')) {
        fetch(`/api/challenges/${challengeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log("Raw delete response:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Read response as text first
        })
        .then(text => {
            console.log("Delete response text:", text);
            return text ? JSON.parse(text) : { success: true }; // Parse only if not empty
        })
        .then(data => {
            console.log("Parsed delete response:", data);
            if (data.success) {
                alert('Challenge deleted successfully!');
                location.reload(); // Reload the page after deletion
            } else {
                alert('Error deleting challenge: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error deleting challenge:', error);
            alert('An error occurred while deleting the challenge.');
        });
    }
}

// Function to handle challenge update
function editChallenge(challengeId, currentDescription, currentSkillpoints) {
    const newDescription = prompt('Edit Challenge Description', currentDescription);
    const newSkillpoints = prompt('Edit Skill Points', currentSkillpoints);

    if (newDescription && newSkillpoints) {
        const updatedChallenge = {
            user_id: parseInt(userId, 10),
            challenge: newDescription,
            skillpoints: parseInt(newSkillpoints, 10),
            challenge_id: parseInt(challengeId, 10) // Ensure ID is an integer
        };

        const url = `/api/challenges/${challengeId}`;
        console.log("Making PUT request to:", url, "With data:", updatedChallenge); 

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedChallenge)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Update response:", data);
        
            const updatedChallengeId = parseInt(data.challenge_id, 10);
            
            if (updatedChallengeId) {
                alert('Challenge updated successfully!');
        
                const challengeText = document.getElementById(`challenge-text-${updatedChallengeId}`);
                const challengePoints = document.getElementById(`challenge-points-${updatedChallengeId}`);
        
                if (challengeText && challengePoints) {
                    challengeText.innerText = data.challenge;
                    challengePoints.innerText = data.skillpoints;
                } else {
                    console.warn(`Elements for challenge ID ${updatedChallengeId} not found. Reloading page.`);
                    location.reload();  // Reload if elements are missing
                }
            } else {
                alert('Error updating challenge: Received invalid ID');
            }
        });
    }
}