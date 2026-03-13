const User = require("../models/UserModel");
const Otp = require("../models/OtpModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Email is required." });
    }

    await Otp.deleteMany({ email });

    const otp = crypto.randomInt(100000, 999999).toString();
    await Otp.create({ email, otp });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Netflix Clone - Verify Your Email",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:2rem;background:#141414;color:#fff;border-radius:8px;">
          <h2 style="color:#e50914;">Netflix Clone</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing:8px;text-align:center;color:#e50914;">${otp}</h1>
          <p style="color:#757575;font-size:0.85rem;">This code expires in 5 minutes.</p>
        </div>
      `,
    });

    return res.json({ msg: "OTP sent successfully." });
  } catch (error) {
    return res.status(500).json({ msg: "Error sending OTP." });
  }
};

module.exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required." });
    }

    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ msg: "Invalid or expired OTP." });
    }

    await Otp.deleteMany({ email });
    return res.json({ msg: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json({ msg: "Error verifying OTP." });
  }
};

module.exports.getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else return res.json({ msg: "User with given email not found.", movies: [] });
  } catch (error) {
    return res.json({ msg: "Error fetching movies.", movies: [] });
  }
};

module.exports.addToLikedMovies = async (req, res) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
      if (!movieAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedMovies: [...user.likedMovies, data],
          },
          { new: true }
        );
      } else return res.json({ msg: "Movie already added to the liked list." });
    } else await User.create({ email, likedMovies: [data] });
    return res.json({ msg: "Movie successfully added to liked list." });
  } catch (error) {
    return res.json({ msg: "Error adding movie to the liked list" });
  }
};

module.exports.removeFromLikedMovies = async (req, res) => {
  try {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (movieIndex === -1) {
        return res.status(400).send({ msg: "Movie not found." });
      }
      movies.splice(movieIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true }
      );
      return res.json({ msg: "Movie successfully removed.", movies });
    } else return res.json({ msg: "User with given email not found." });
  } catch (error) {
    return res.json({ msg: "Error removing movie to the liked list" });
  }
}; 


// Add this to userController.js
module.exports.createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ msg: "User already exists." });
    }
    await User.create({ email, likedMovies: [] });
    return res.json({ msg: "User created successfully." });
  } catch (error) {
    return res.json({ msg: "Error creating user." });
  }
};