"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const authenticatejwt_1 = require("../middlewares/authenticatejwt");
const router = (0, express_1.Router)();
router.get("/", authenticatejwt_1.authenticateJWT, users_controllers_1.getAllUsers);
router.get("/:id", authenticatejwt_1.authenticateJWT, users_controllers_1.getSingleUser);
exports.default = router;
