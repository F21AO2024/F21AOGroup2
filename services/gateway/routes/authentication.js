import { get } from "mongoose";
import { register, login, changePassword, getUserById } from "../controller/authController.js";
import express from "express";


const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);
router.get("/:id", getUserById);

export default router;