import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  let token = req.header("authorization");

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  
  if (!token) {
    return res.status(403).send({ message: "No token provided, you need to provide your token in the HeadersL x-access-token : <your-token>" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized, the token is expired or invalid" });
    }
    req.userId = decoded.id;
    req.user = decoded;
    console.log(req.user)
    next();
  });
};




