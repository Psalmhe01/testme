import express from "express";
import AuthController from "../controllers\AuthController.js";
import { Router } from "express";

const router = Router();
router.get("/register", AuthController.showRegisterForm);
router.get("/login", AuthController.showLoginForm);

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);

router.get("/logout", AuthController.logoutUser);

export default router;