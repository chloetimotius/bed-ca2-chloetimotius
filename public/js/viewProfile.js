document.addEventListener("DOMContentLoaded", function () {
  // Retrieve user ID and token from localStorage
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  // If the token is missing, prompt the user to log in
  if (!token) {
    alert("Please login to access");
    window.location.href = "login.html";  // Redirect to login page
    return;
  }

  console.log("Fetching profile for user ID:", userId);

  // Function to make API requests
  function fetchMethod(url, method, data, callback) {
    fetch(url, {
      method: method,
      headers: {
        "Authorization": `Bearer ${token}`,  // Include the token for authorization
        "Content-Type": "application/json",  // Specify content type
      },
      body: method !== "GET" ? JSON.stringify(data) : null,  // Include body if method is not GET
    })
      .then(response => response.json().then(data => callback(response.status, data)))  // Handle response and pass data to callback
      .catch(error => console.error("Error:", error));  // Handle errors
  }

  // Fetch and display user information
  function loadUserInfo() {
    fetchMethod(`/api/users/${userId}`, "GET", null, (status, data) => {
      console.log("User info:", data);

      const userInfo = document.getElementById("userInfo");

      // If user is not found (404 status), display error message
      if (status === 404) {
        userInfo.innerHTML = `<p class="text-danger">${data.message}</p>`;
        return;
      }

      // Display user info in a card format
      userInfo.innerHTML = `
        <div class="card">
          <div class="card-body text-center">
            <h5 class="card-title">User Information</h5>
            <p class="card-text">
              User ID: ${data.user_id} <br>
              Username: ${data.username} <br>
              Email: ${data.email} <br>
              Skill Points: ${data.skillpoints} <br>
              Created On: ${data.created_on} 
            </p>
          </div>
        </div>
      `;

      // Populate form fields for editing profile
      document.getElementById("username").value = data.username;
      document.getElementById("email").value = data.email;
    });
  }

  // Handle profile update form submission
  document.getElementById("updateProfileForm").addEventListener("submit", function (e) {
    e.preventDefault();  // Prevent form submission

    const updatedUserData = {
      username: document.getElementById("username").value,  // Get updated username
      email: document.getElementById("email").value,  // Get updated email
    };

    // Send PUT request to update user profile
    fetchMethod(`/api/users/${userId}`, "PUT", updatedUserData, (status, data) => {
      console.log("Update response:", data);

      // If the update is successful, reload user info and display a success message
      if (status === 200) {
        alert("Profile updated successfully!");
        loadUserInfo();
      } else {
        // If there is an error, display an error message
        alert("Error updating profile: " + data.message);
      }
    });
  });

  // Initial load of user information
  loadUserInfo();

  // Callback function for fetching and displaying all users
  const callbackForAllUsers = (responseStatus, responseData) => {
    console.log("All Users responseStatus:", responseStatus);
    console.log("All Users responseData:", responseData);

    const allUsersContainer = document.getElementById("userList");

    // If the response is not successful (status not 200), display error message
    if (responseStatus !== 200) {
      allUsersContainer.innerHTML = `<p class="text-danger">Failed to fetch users.</p>`;
      return;
    }

    // Create the HTML structure for displaying the list of all users
    let userListHTML = `<h5 class="text-center">All Users</h5>`;
    responseData.forEach(user => {
      userListHTML += `
      <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 p-2">
        <div class="card">
          <div class="card-body text-center p-2">
            <p class="card-text">
              User ID: ${user.user_id} <br>
              Username: ${user.username} <br>
              Skill Points: ${user.skillpoints} <br>
              Created On: ${user.created_on} 
            </p>
          </div>
        </div>
      </div>
      `;
    });

    // Display the list of users
    allUsersContainer.innerHTML = userListHTML;
  };

  // Fetch the list of all users
  fetchMethod(`${currentUrl}/api/users`, "GET", null, callbackForAllUsers);
});
