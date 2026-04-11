import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { approvedProposals } from "../controllers/documentController.js";
import { downloadDocuments } from "../controllers/proposalController.js";

const router = express.Router();

router.get("/approved", authenticate, approvedProposals);
router.get("/:id/download", downloadDocuments);

export default router;