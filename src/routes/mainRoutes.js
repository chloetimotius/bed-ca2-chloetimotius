// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');
const router = express.Router();

// ##############################################################
// CREATE ROUTER
// ##############################################################
const challengesRoutes = require('./challengesRoutes');
const usersRoutes = require('./usersRoutes');
const gamificationRoutes = require('./gamificationRoutes');
const reviewRoutes = require('./reviewRoutes');
const userController = require('../controllers/usersController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');

// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.use("/challenges", challengesRoutes);
router.use("/users", usersRoutes);
router.use("/characters", gamificationRoutes);
router.use("/review", reviewRoutes);
router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;