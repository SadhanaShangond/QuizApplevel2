const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", ""); // notice the space

  if (!token) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid Token" });
      }

      try {
        const user = await User.findById(decoded.userId);
        if (!user) {
          return res.status(403).json({ message: "User not found" });
        }
        req.user = user;
        next();
      } catch (error) {
        console.error("Error authenticate user", error);
        return res.status(500).json({ success: false, message: error.message });
      }
    });
  } catch (error) {
    console.error("JWT verify failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
