const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let authToken;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    authToken = authHeader.split(" ")[1];
    jwt.verify(authToken, process.env.JWT_SIGNATURE, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;
      next();
    });
    if (!authToken) {
      res.status(401);
      throw new Error("User is not authorized");
    }
  }
});

module.exports = validateToken;
