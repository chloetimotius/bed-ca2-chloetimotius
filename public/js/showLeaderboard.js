document.addEventListener("DOMContentLoaded", function () {
    // Define the callback to process the response from the API
    const callback = (responseStatus, responseData) => {
        // Log the response status and data for debugging purposes
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);
  
        // Get the leaderboard container element from the DOM (where the leaderboard will be displayed)
        const leaderboardList = document.getElementById("leaderboardList");
  
        // Clear any existing content inside the leaderboard container
        leaderboardList.innerHTML = '';
  
        // Iterate through the response data (which is the leaderboard data)
        responseData.forEach((leader, index) => {
            // Create a new list item for each leaderboard entry
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center"; // Add Bootstrap classes for styling
  
            // Calculate the rank by adding 1 to the index (index is 0-based, so we add 1 for a 1-based rank)
            const rank = index + 1;
            
            // Populate the list item with the rank, character name, and level
            listItem.innerHTML = `
                <strong>Rank ${rank}</strong> - ${leader.character_name} 
                <span class="badge bg-primary rounded-pill">${leader.level}</span>
            `;
  
            // Append the newly created list item to the leaderboard list in the DOM
            leaderboardList.appendChild(listItem);
        });
    };
  
    // Fetch leaderboard data from the API endpoint and pass the response to the callback function
    fetchMethod(currentUrl + "/api/characters/leaderboard", callback); // Ensure that the endpoint is correct
});
