//adapted from auth.js in services/gateway/middleware/auth.js
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    let token = req.header("authorization");
    if (!token) {
        return res.status(403).send({ message: "You did not provide your token, please add it in the headers as <Authorization>: <your token>", success: false});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized, this token is not legitimate or expired", success: false});
      }
      //decrypt the token and get the userid and role
      req.user = decoded;
      req.id = decoded.id;
      //another idea of thought is to take the deocded user and pass it instead of relying to the incomign req
      console.log(`authRole.js: user id = ${req.id}`);
      next();
    });
} catch (error) {
    console.log(error);
    return res.status(500).send({ message: "An Internal server error occurred", success: false});
  }
}
module.exports = checkAuth;