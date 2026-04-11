import Proposal from "../models/Proposal.js";

/* ================= ADD REVIEW COMMENT ================= */

export const addReviewComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, decision } = req.body;

    if (!text || !decision) {
      return res.status(400).json({
        message: "Comment text and decision are required"
      });
    }

    if (!["approved", "revision_required", "rejected"].includes(decision)) {
      return res.status(400).json({
        message: "Invalid decision"
      });
    }

    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const isAssigned =
      (proposal.reviewers && proposal.reviewers.some(r => r.toString() === req.user.id)) ||
      (proposal.assignedTo && proposal.assignedTo.some(r => r.toString() === req.user.id));

    if (!isAssigned) {
      return res.status(403).json({
        message: "You are not assigned to this proposal"
      });
    }

    if (proposal.status !== "under_review") {
      return res.status(400).json({
        message: "Proposal is not under review"
      });
    }

    // Add comment
    proposal.comments.push({
      reviewer: req.user.id,
      text,
      decision
    });

    // Update proposal status
    proposal.status = decision;

    await proposal.save();

    res.json({
      message: "Review submitted successfully",
      proposal
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit review"
    });
  }
};