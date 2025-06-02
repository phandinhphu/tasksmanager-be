const jwt = require("jsonwebtoken");
const userSchema = require("../apis/models/User");
const dotenv = require("dotenv");

dotenv.config();

module.exports = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userSchema.findById(decoded.id).select("-password");
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!", error });
  }
};
