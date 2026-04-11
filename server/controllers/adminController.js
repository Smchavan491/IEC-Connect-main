import Proposal from "../models/Proposal.js";
import User from "../models/User.js";

/* ─────────────────────────────────────────────
   FEE RULES  (based on the IEC fee schedule)
   Maps study-type keywords → fee label
   ───────────────────────────────────────────── */
const FEE_RULES = [
  {
    category: "Research from Other Institute",
    match: (p) => p.sectionA?.typeOfResearch?.includes("Research from Other Institute"),
    baseFee: 10000,
    gst: 0,
    accountNumber: "0493104000083232"
  },
  {
    category: "PG Student Dissertation Research",
    match: (p) => p.sectionA?.typeOfResearch?.includes("PG Student Dissertation Research"),
    baseFee: 5000,
    gst: 0,
    accountNumber: "0493104000083232"
  },
  {
    category: "Other Academic (DNB, DM, Nursing, PhD Research)",
    match: (p) => p.sectionA?.typeOfResearch?.includes("Other Academic (DNB, DM, Nursing, PhD Research)"),
    baseFee: 5000,
    gst: 0,
    accountNumber: "0493104000083232"
  },
  {
    category: "Clinical Trial",
    match: (p) => p.sectionA?.typeOfResearch?.includes("Clinical Trial"),
    baseFee: 95000,
    gst: 17100,
    accountNumber: "0458104000255486" // Pharma/Clinical account
  },
];

export function getFeeInfo(proposal) {
  let highestFeeRule = {
    required: false,
    feeCategory: "NIL",
    baseFee: 0,
    gstAmount: 0,
    totalPayable: 0,
    accountNumber: "N/A"
  };

  for (const rule of FEE_RULES) {
    if (rule.match(proposal)) {
      const currentTotal = rule.baseFee + rule.gst;
      
      // Keep track of the most expensive rule applicable
      if (currentTotal > highestFeeRule.totalPayable) {
        highestFeeRule = {
          required: true,
          feeCategory: rule.category,
          baseFee: rule.baseFee,
          gstAmount: rule.gst,
          totalPayable: currentTotal,
          accountNumber: rule.accountNumber
        };
      }
    }
  }

  return highestFeeRule;
}

/* ================= GET ALL REVIEWERS ================= */
export const getAllReviewers = async (req, res) => {
  try {
    const reviewers = await User.find({ role: "reviewer" }).select(
      "_id name email shortCode"
    );
    res.json(reviewers);
  } catch {
    res.status(500).json({ message: "Failed to fetch reviewers" });
  }
};

/* ================= PROPOSALS AWAITING ADMIN ACTION ================= */
export const getProposalsForAssignment = async (req, res) => {
  try {
    // Show all proposals except drafts for admin to manage
    const proposals = await Proposal.find({
      status: { $ne: "draft" },
    })
      .select(
        "_id title status createdAt administrative research paymentStatus totalPayable paymentProofUrl rejectionReason withdrawnAt withdrawnBy"
      )
      .populate("withdrawnBy", "name role")
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch proposals" });
  }
};

/* ================= MARK PAYMENT AS VERIFIED (Admin) ================= */
export const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    proposal.paymentStatus = "Payment Verified";
    proposal.status = "submitted"; // Reset to submitted so it can be forwarded
    proposal.paymentVerifiedBy = req.user.id;
    proposal.paymentVerifiedAt = new Date();

    await proposal.save();
    res.json({ message: "Payment verified successfully", proposal });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify payment", error: error.message });
  }
};

/* ================= REJECT PAYMENT (Admin) ================= */
export const rejectPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Rejection reason is required" });

    const proposal = await Proposal.findById(id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    proposal.paymentStatus = "Rejected";
    proposal.status = "fees_pending";
    proposal.rejectionReason = reason;

    await proposal.save();
    res.json({ message: "Payment rejected", proposal });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject payment", error: error.message });
  }
};

/* ================= ADMIN VERIFY & FORWARD TO SCRUTINY ================= */
export const verifyProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Block verification if fees are required but not yet verified
    if (proposal.totalPayable > 0 && proposal.paymentStatus !== "Payment Verified") {
      return res.status(400).json({
        message: `Review fee of ₹${proposal.totalPayable} must be verified as paid before verifying this proposal.`,
      });
    }

    const scrutinyUsers = await User.find({ role: "scrutiny" });
    if (scrutinyUsers.length === 0) {
      return res
        .status(400)
        .json({ message: "No Scrutiny Member found to assign." });
    }

    proposal.assignedTo = scrutinyUsers.map((u) => u._id);
    proposal.status = "admin_verified";

    await proposal.save();

    res.json({
      message: "Proposal verified and forwarded to Scrutiny",
      proposal,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
};

/* ================= ASSIGN REVIEWERS (legacy) ================= */
export const assignReviewers = async (req, res) => {
  try {
    const { reviewers } = req.body;

    if (!Array.isArray(reviewers) || reviewers.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one reviewer must be assigned" });
    }

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.status !== "submitted") {
      return res
        .status(400)
        .json({ message: "Proposal is not eligible for assignment" });
    }

    proposal.reviewers = reviewers;
    proposal.assignedTo = reviewers;
    proposal.status = "under_review";

    await proposal.save();

    res.json({ message: "Reviewers assigned successfully", proposal });
  } catch {
    res.status(500).json({ message: "Failed to assign reviewers" });
  }
};

/* ================= RETURN PROPOSAL FOR CORRECTION (Admin) ================= */
export const returnProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Reason for return is required" });

    const proposal = await Proposal.findById(id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    proposal.status = "returned";
    proposal.returnReason = reason;

    // Optional: Reset payment status if needed? 
    // Usually correction is for form data, not payment.

    await proposal.save();
    res.json({ message: "Proposal returned for correction", proposal });
  } catch (error) {
    res.status(500).json({ message: "Failed to return proposal", error: error.message });
  }
};

/* ================= REJECT PROPOSAL (Admin) ================= */
export const rejectProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Rejection reason is required" });

    const proposal = await Proposal.findById(id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    proposal.status = "rejected";
    proposal.rejectionReason = reason;

    await proposal.save();
    res.json({ message: "Proposal has been rejected permanently", proposal });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject proposal", error: error.message });
  }
};