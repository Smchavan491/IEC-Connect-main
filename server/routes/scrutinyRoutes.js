import express from "express";
import { getScrutinyDashboard, scrutinyAction } from "../controllers/scrutinyController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/dashboard", authenticate, authorizeRoles("scrutiny"), getScrutinyDashboard);
router.post("/:id/action", authenticate, authorizeRoles("scrutiny"), scrutinyAction);

export default router;
