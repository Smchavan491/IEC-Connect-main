import express from "express";
import { clearProposals, clearUsers, fullReset } from "../controllers/cleanupController.js";
import { ensureAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only cleanup endpoints
router.post("/proposals/clear", ensureAdmin, clearProposals);
router.post("/users/clear", ensureAdmin, clearUsers);
router.post("/full-reset", ensureAdmin, fullReset);

export default router;
