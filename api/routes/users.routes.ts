import { Router } from "express";
import { getAllUsers, getSingleUser } from "../controllers/users.controllers";
import { authenticateJWT } from "../middlewares/authenticatejwt";

const router = Router();

router.get("/", authenticateJWT as any, getAllUsers as any);
router.get("/:id", authenticateJWT as any, getSingleUser as any);

export default router;
