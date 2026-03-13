const{
    addToLikedMovies,
    getLikedMovies,
    removeFromLikedMovies,
    createUser,
    sendOtp,
    verifyOtp
} = require("../controllers/UserController");

const router = require("express").Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", createUser);
router.post("/add", addToLikedMovies);
router.get("/liked/:email", getLikedMovies);
router.put("/remove", removeFromLikedMovies);

module.exports = router; 
