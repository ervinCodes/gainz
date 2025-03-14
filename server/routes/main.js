const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const postsController = require("../controllers/posts");
const homeController = require("../controllers/home");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - Pages
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.post("/signup", authController.postSignup);
router.post("/createWorkout", ensureAuth, postsController.postWorkout)
router.get("/getWorkouts", ensureAuth, postsController.getWorkouts)
router.get("/getWorkout/:id", ensureAuth, postsController.getSingleWorkout)
router.delete("/:id", ensureAuth, postsController.deleteWorkout)
router.put("/updateExercises/:id", ensureAuth, postsController.updateExercises)
router.get("/exerciseList", ensureAuth, homeController.getExerciseList);
router.post("/addCustomExercise", ensureAuth, postsController.postCustomExercise)


module.exports = router;

