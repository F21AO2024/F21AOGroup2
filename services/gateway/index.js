import express from "express";
import { ROUTES } from "./routes/routes.js";

import { logger } from "./utils/logging.js";
import { proxies } from "./utils/proxy.js";
import { setupAuth } from "./middleware/auth.js";
import authentication from "./routes/authentication.js";


import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// logger(app);
// setupAuth(app, ROUTES);
// proxies(app, ROUTES);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authentication);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
