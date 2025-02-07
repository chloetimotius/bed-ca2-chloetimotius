# Starter Repository for Assignment

Folder Structure:
src/
  ├── configs/
  │   ├── createSchema.js        # Creates database schema
  │   ├── initTables.js          # Initializes database tables
  ├── controllers/
  │   ├── challengesController.js # Handles logic for challenges
  │   ├── gamificationController.js # Manages gamification features
  │   ├── reviewController.js    # Manages review-related functionality
  │   ├── usersController.js     # Manages user-related functionality
  ├── middlewares/
  │   ├── bcryptMiddleware.js    # Middleware for bcrypt hashing
  │   ├── jwtMiddleware.js       # Middleware for JWT authentication
  ├── models/
  │   ├── challengesModel.js     # Database models for challenges
  │   ├── gamificationModel.js   # Database models for gamification
  │   ├── reviewModel.js         # Database models for reviews
  │   ├── usersModel.js          # Database models for users
  ├── routes/
  │   ├── challengesRoutes.js    # Routes for challenges
  │   ├── gamificationRoutes.js  # Routes for gamification
  │   ├── mainRoutes.js          # Main routes for the application
  │   ├── reviewRoutes.js        # Routes for reviews
  │   ├── usersRoutes.js         # Routes for users
  ├── services/
  │   ├── db.js                  # Database connection and configuration
  ├── public/
  │   ├── css/
  │   │   ├── color.css          # Color styles
  │   │   ├── style.css          # Main styles
  │   ├── images/
  │   │   ├── atsushi.jpg        # Character image
  │   │   ├── dazai.jpg          # Character image
  │   │   ├── fyodor.jpg         # Character image
  │   │   ├── kunikida.jpg       # Character image
  │   │   ├── nikolai.jpg        # Character image
  │   │   ├── ranpo.jpg          # Character image
  │   ├── js/
  │   │   ├── createChallenge.js # Logic for creating challenges
  │   │   ├── getCurrentURL.js   # URL handling
  │   │   ├── levelUpAbilities.js # Logic for leveling up abilities
  │   │   ├── loginUser.js       # User login logic
  │   │   ├── queryCmds.js       # Command query handler
  │   │   ├── registerUser.js    # User registration logic
  │   │   ├── sendReview.js      # Sending reviews logic
  │   │   ├── showAllChallenges.js # Displays all challenges
  │   │   ├── showAllCharacters.js # Displays all characters
  │   │   ├── showLeaderboard.js # Displays the leaderboard
  │   │   ├── showMyReviews.js   # Displays user's reviews
  │   │   ├── showReviews.js     # Displays reviews
  │   │   ├── userNavbarToggle.js # Handles user navbar toggle
  │   │   ├── viewProfile.js     # View user profile
  │   ├── Abilities.html         # Page for abilities
  │   ├── challenges.html        # Page for challenges
  │   ├── editChallenge.html     # Page to edit challenge
  │   ├── editReview.html        # Page to edit review
  │   ├── index.html             # Homepage
  │   ├── leaderboard.html       # Page for leaderboard
  │   ├── login.html             # Login page
  │   ├── profile.html           # User profile page
  │   ├── register.html          # Registration page
  │   ├── review.html            # Review page
  │   ├── sendReview.html        # Page to send review
  ├── app.js                     # Application entry point
  ├── .env                       # Environment variables file
  ├── .gitignore                 # Git ignore file
  ├── index.js                   # Entry point for the application
  ├── package-lock.json          # Package lock file for dependencies
  ├── package.json               # Project metadata and dependencies
  ├── README.md                  # Project documentation

To start please download these node modules first
- express
- mysql2
- dotenv
- nodemon
- bycrypt
- jsonwebtoken

Next, ensure that you have the .env with the correct contents as below
DB_HOST=localhost
DB_USER=root 
DB_PASSWORD=root
DB_DATABASE=fitness
JWT_SECRET_KEY=your-secret-key
JWT_EXPIRES_IN=15m
JWT_ALGORITHM=HS256

Finally,
To create and insert tables from the config folder
1. Open the terminal
2. Enter npm run init_tables into the terminal
3. This should create and insert into table 'fitness'
4. To run the server, enter npm run dev
5. To test API endpoints do click on the postman icon on the left side of the screen and run ur requests accordingly
For example:
localhost:3000/gamification/characters/user-abilities

IMPORTANT:
6. Please read the comments below each section as they help to identify what each part does
For example:
// ##############################################################
// DEFINE CONTROLLER FUNCTION TO CREATE USER
// ##############################################################
/*
 - Controller to create a new user.
 - Validates the request body, checks if the username already exists,
   and inserts a new user into the database.
*/
// ##############################################################
// DEFINE SELECT ALL OPERATIONS FOR ABILITIES
// ##############################################################
/*
  This function retrieves all abilities from the database.
  It fetches every entry from the Ability table.
*/
These are the types of requests and Endpoints
- GET to fetch data
- POST to create new data (e.g., creating challenges or users)
- PUT to update existing data
- DELETE to remove data

Project Structure Details
1. Controllers:
Each controller file handles the business logic for a specific domain (e.g., users, challenges, reviews). For example:
usersController.js handles logic for user management (login, registration, etc.).
challengesController.js contains logic for managing challenges.
2. Middlewares:
bcryptMiddleware.js: Used for securely hashing user passwords before storing them in the database.
jwtMiddleware.js: Middleware for verifying JWT tokens to ensure secure access to protected routes, stores the user's id and token in the storage
3. Models:
Contains files like usersModel.js and challengesModel.js, which define the structure of the database tables and interact with the database.
4. Routes:
This folder contains all the route definitions for each domain. Routes map to controller functions for specific API endpoints.
5. Public:
Contains static files (images, CSS, JavaScript) served to the client.
CSS: Contains stylesheets like color.css and style.css.
JS: Contains the client-side JavaScript files for handling user interactions.
7. Testing frontend
Open Google and type in http://localhost:3000/
Note: Ensure that the server is running
8. For any issues open R12 on the browser and console to view the issues in greater detail
9. Contributing
If you'd like to contribute, please fork the repository and submit a pull request. Make sure to follow the coding standards and provide clear commit messages.
10. Enjoy the code and stay fit :>
