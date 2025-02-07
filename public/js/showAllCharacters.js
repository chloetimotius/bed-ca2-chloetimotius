document.addEventListener("DOMContentLoaded", function () {
    // Callback function to process the response data
    const callback = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus); // Logs the response status for debugging
        console.log("responseData:", responseData); // Logs the response data for debugging

        const characterList = document.getElementById("characterList"); // Get the container to display the characters
        
        // Iterate over each character in the response data
        responseData.forEach((character) => {
            let image = ''; // Initialize an empty string for the character image

            // Object mapping ability IDs to image file paths
            const abilityImages = {
                1: { image: "images/atsushi.jpg" },
                2: { image: "images/dazai.jpg" },
                3: { image: "images/kunikida.jpg" },
                4: { image: "images/ranpo.jpg" },
                5: { image: "images/fyodor.jpg" },
                6: { image: "images/nikolai.jpg" }
            };
            
            // Check if the character's ability_id exists in the abilityImages object
            if (abilityImages[character.ability_id]) {
                // If found, assign the corresponding image to the 'image' variable
                image = `<img src="${abilityImages[character.ability_id].image}" alt="${character.ability_name}" class="img-fluid">`;
            } else {
                // Alert the user if no matching ability ID is found
                alert("Error retrieving the characters");
                return; // Exit the function early to avoid rendering incomplete data
            }

            // Create a new div element to hold the character's card
            const displayItem = document.createElement("div");
            displayItem.className = "col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-3"; // Apply responsive grid layout
            displayItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${character.character_name}</h5> <!-- Character name -->
                        <p class="card-text">
                            <strong>Ability ID:</strong> ${character.ability_id} <br> <!-- Ability ID -->
                            <strong>Ability Name:</strong> ${character.ability_name} <!-- Ability name -->
                            ${image} <!-- Ability image -->
                        </p>
                    </div>
                </div>
            `;
            // Append the newly created card to the characterList container
            characterList.appendChild(displayItem);
        });
    };

    // Fetch character data from the specified API endpoint and call the callback function with the response
    fetchMethod(currentUrl + "/api/characters/user-abilities", callback);
});
