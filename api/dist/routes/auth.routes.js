"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post("/signup", auth_controllers_1.signup);
router.get("/verify/:token", auth_controllers_1.verifyEmail);
router.post("/signin", auth_controllers_1.signin);
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/signin" }), auth_controllers_1.googleAuth);
exports.default = router;
