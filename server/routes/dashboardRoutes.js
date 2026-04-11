import express from "express";
import {
  researcherDashboard,
  reviewerDashboard,
  adminDashboard
} from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/researcher",
  authenticate,
  authorizeRoles("researcher"),
  researcherDashboard
);

router.get(
  "/reviewer",
  authenticate,
  authorizeRoles("reviewer"),
  reviewerDashboard
);

router.get(
  "/admin",
  authenticate,
  authorizeRoles("admin"),
  adminDashboard
);

export default router;