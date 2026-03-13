const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/UserRoutes");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connetion Successfull");
  }) 
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/user", userRoutes);
const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`server started on port ${port}`);
}); 
 

