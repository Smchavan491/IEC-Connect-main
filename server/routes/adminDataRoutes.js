import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  getDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getQueries,
  replyToQuery
} from "../controllers/adminDataController.js";

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles("admin"));

// Documents
router.get("/documents", getDocuments);
router.post("/documents", upload.single("file"), uploadDocument);
router.put("/documents/:id", upload.single("file"), updateDocument);
router.delete("/documents/:id", deleteDocument);

// Announcements
router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);
router.put("/announcements/:id", updateAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

// Contact Queries
router.get("/queries", getQueries);
router.put("/queries/:id/reply", replyToQuery);

export default router;
