const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");
const Reception = require("../models/Reception");

// =============================================================
// 🔍 Get user by ID from Admin, Doctor, or Reception collections
// =============================================================
const getUserById = async (id) => {
  let user = await Admin.findById(id).select("-password");
  if (!user) user = await Doctor.findById(id).select("-password");
  if (!user) user = await Reception.findById(id).select("-password");

  if (!user) {
    console.log("❌ User not found in the database for ID:", id);
  }
  
  return user;
};

// =============================================================
// 🛡️ Protect middleware (verify token & attach user to request)
// =============================================================
const protect = async (req, res, next) => {
  let token = null;

  // ✅ Support both Cookie & Authorization Header
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.role) {
      return res.status(500).json({ message: "User role is missing" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Token Error:", error.message);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = protect;
