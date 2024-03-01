import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  let token = req.header("Authorization");
  
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }
  console.log(token);


  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.user = decoded;
    next();
  });
};

