const mongoose = require("mongoose");
require("dotenv").config();

const db = async () => {
  try {
   await mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("MongoDB connected successfully...👍");
    })
  
  } catch (error) {
    console.log("Failed to connect MongoDB...❌", error);
  }
};

module.exports = db;
