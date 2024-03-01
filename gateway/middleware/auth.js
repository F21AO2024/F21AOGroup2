import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(403).send({ message: "No token provided, you need to provide your token in the Authorization, choose Bearer" });
  }
  
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized, this token is not legitimate or expired" });
    }
    req.user = decoded;
    next();
  });
};



