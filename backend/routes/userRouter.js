import express from "express";
import { getUser, login, logout, register, updatePassword, updateProfile } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);  // getUser isAuthenticated ke ander ke saare resources ko access kr sahkta hai jese req.user ko bhi 
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);

export default router; // ab isko app.js me import krlo 