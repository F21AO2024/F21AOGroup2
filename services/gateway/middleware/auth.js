import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  let token = req.header("authorization");

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};


export const setupAuth = (app, routes) => {
  routes.forEach(r => {
      if (r.auth) {
          app.use(r.url, verifyToken, function (req, res, next) {
              next();
          });
      }
  });
}

