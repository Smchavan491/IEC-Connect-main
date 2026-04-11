import express from "express";
import { addReviewComment } from "../controllers/reviewerController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/proposals/:id/review",
  authenticate,
  authorizeRoles("reviewer"),
  addReviewComment
);

export default router;