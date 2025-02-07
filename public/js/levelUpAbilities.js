document.addEventListener("DOMContentLoaded", function () {
  // Retrieve token and user ID from local storage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  // Check if token exists in local storage, if not, redirect to login page
  if (!token) {
      alert("Please login to access");
      window.location.href = "login.html"; // Redirect to login page
      return; // Stop further execution
  }

  // Fetch user data (such as skill points) using user ID
  const fetchUserData = (userId) => {
      fetch(`${currentUrl}/api/users/${userId}`) // Send GET request to fetch user data
          .then(response => response.json()) // Parse response as JSON
          .then(userData => {
              if (userData && userData.skillpoints) {
                  console.log("User's skill points:", userData.skillpoints); // Log skill points
                  fetchAbilities(userData.skillpoints); // Fetch abilities if skill points are available
              } else {
                  alert("Please earn skill points through challenges first."); // Alert if no skill points
              }
          })
          .catch(error => {
              alert("Error fetching user data: " + error); // Handle errors in fetching user data
          });
  };

  // Function to fetch abilities using the user's skill points
  const fetchAbilities = (userSkillPoints) => {
      fetchMethod(`${currentUrl}/api/characters/user-abilities`, (status, data) => {
          console.log("Response Status:", status); // Log response status
          console.log("Response Data:", data); // Log response data

          const abilityCardsContainer = document.getElementById("ability-cards-container");

          // Mapping ability IDs to corresponding image paths
          const abilityImages = {
              1: "images/atsushi.jpg",
              2: "images/dazai.jpg",
              3: "images/kunikida.jpg",
              4: "images/ranpo.jpg",
              5: "images/fyodor.jpg",
              6: "images/nikolai.jpg"
          };

          // Check if abilities exist and render them on the page
          if (data && data.length > 0) {
              data.forEach((ability) => {
                  const abilityCard = document.createElement("div");
                  abilityCard.className = "col-lg-3 col-md-6 col-sm-12 pb-3"; // Set column layout for the ability cards

                  // Get the image for the character based on ability_id
                  const image = abilityImages[ability.ability_id] ? `<img src="${abilityImages[ability.ability_id]}" alt="${ability.character_name}" class="img-fluid">` : "";

                  // Construct the HTML for each ability card
                  abilityCard.innerHTML = `
                      <div class="card">
                          <div class="card-body">
                              <h5 class="card-title">${ability.character_name} - ${ability.ability_name}</h5>
                              <p class="card-text">
                                  Level: <span id="level-${ability.ability_id}">${ability.level}</span><br>
                                  Ability ID: ${ability.ability_id}<br>
                                  Skill Points Left: <span id="skill-points-${ability.ability_id}">${userSkillPoints}</span>
                                  (50 skillpoints per lvl)
                              </p>
                              ${image} <!-- Add character image if available -->
                              <button class="btn btn-primary level-up-btn" 
                                      data-ability-id="${ability.ability_id}" 
                                      data-user-id="${userId}" 
                                      data-skill-points="${userSkillPoints}">Level Up</button>
                          </div>
                      </div>
                  `;
                  abilityCardsContainer.appendChild(abilityCard); // Append the new card to the container
              });

              // Add event listeners to each "Level Up" button
              document.querySelectorAll('.level-up-btn').forEach(button => {
                  button.addEventListener('click', function () {
                      const abilityId = button.getAttribute('data-ability-id');
                      const userId = button.getAttribute('data-user-id');
                      let skillPoints = parseInt(button.getAttribute('data-skill-points'));  // Get current skill points

                      // Check if the user has enough skill points to level up
                      if (skillPoints >= 50) {
                          // Subtract 50 skill points to level up
                          skillPoints -= 50;
                          button.setAttribute('data-skill-points', skillPoints);  // Update button's skill points attribute

                          // Level up the character
                          levelUpCharacter(userId, abilityId, skillPoints, button);
                      } else {
                          alert("Not enough skill points to level up."); // Alert if not enough points
                      }
                  });
              });
          } else {
              abilityCardsContainer.innerHTML = "<p>No abilities found for this user.</p>"; // Display message if no abilities
          }
      });
  };

  // Fetch user data when the page loads
  fetchUserData(userId);

  // Function to handle leveling up the character
  function levelUpCharacter(userId, abilityId, skillPoints, button) {
      console.log("Payload being sent:", { user_id: userId, ability_id: abilityId, skill_points: skillPoints }); // Log the data being sent

      const payload = {
          user_id: userId,
          ability_id: abilityId,
          skill_points: skillPoints  // Send updated skill points in the payload
      };

      // Make a POST request to level up the character
      fetch(`${currentUrl}/api/characters/level-up`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload) // Send the data as JSON
      })
      .then(response => response.json()) // Parse the response as JSON
      .then(data => {
          if (data.error) {
              alert('Error: ' + data.error); // Display error if any
          } else {
              alert(data.message + " Remaining points: " + data.remaining_points); // Show success message

              // Update the ability's level and skill points in the UI
              const levelSpan = document.getElementById(`level-${abilityId}`);
              levelSpan.textContent = parseInt(levelSpan.textContent) + 1;  // Increment level

              const skillPointsSpan = document.getElementById(`skill-points-${abilityId}`);
              skillPointsSpan.textContent = data.remaining_points;  // Update remaining skill points

              // Update button's skill points to reflect remaining points
              button.setAttribute('data-skill-points', data.remaining_points);

              // Refresh the page to reflect all updates in user data
              location.reload();  // Reload to fetch the latest user data
          }
      })
      .catch(error => alert('An error occurred: ' + error)); // Handle fetch errors
  }
});
