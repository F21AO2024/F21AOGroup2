import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.header("x-access-token");

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
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

