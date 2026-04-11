import Proposal from "../models/Proposal.js";
import User from "../models/User.js";

/* ================= RESEARCHER ================= */

export const researcherDashboard = async (req, res) => {
  const researcherId = req.user.id;

  const proposals = await Proposal.find({ researcher: researcherId })
    .sort({ createdAt: -1 });

  const stats = {
    total: await Proposal.countDocuments({ researcher: researcherId }),
    underReview: await Proposal.countDocuments({
      researcher: researcherId,
      status: "under_review"
    }),
    approved: await Proposal.countDocuments({
      researcher: researcherId,
      status: "approved"
    }),
    actionRequired: await Proposal.countDocuments({
      researcher: researcherId,
      status: { $in: ["revision_required", "fees_pending", "returned"] }
    })
  };

  res.json({ stats, recentProposals: proposals });
};

/* ================= REVIEWER ================= */

export const reviewerDashboard = async (req, res) => {
  try {
    const reviewerId = req.user.id;

    const assignedProposals = await Proposal.find({
      $or: [{ assignedTo: reviewerId }, { reviewers: reviewerId }]
    })
      .select("title status createdAt researcher")
      .populate("researcher", "shortCode")
      .sort({ createdAt: -1 });

    const stats = {
      totalAssigned: await Proposal.countDocuments({
        $or: [{ assignedTo: reviewerId }, { reviewers: reviewerId }]
      }),
      pending: await Proposal.countDocuments({
        $or: [{ assignedTo: reviewerId }, { reviewers: reviewerId }],
        status: "under_review"
      }),
      completed: await Proposal.countDocuments({
        $or: [{ assignedTo: reviewerId }, { reviewers: reviewerId }],
        status: { $in: ["approved", "rejected"] }
      })
    };

    res.json({
      stats,
      assignedProposals
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load reviewer dashboard data"
    });
  }
};

/* ================= ADMIN ================= */

export const adminDashboard = async (req, res) => {
  try {
    const [
      totalProposals,
      approved,
      underReview,
      revisionRequired,
      rejected,
      totalUsers,
      totalResearchers,
      totalReviewers
    ] = await Promise.all([
      Proposal.countDocuments(),
      Proposal.countDocuments({ status: "approved" }),
      Proposal.countDocuments({ status: "under_review" }),
      Proposal.countDocuments({ status: "revision_required" }),
      Proposal.countDocuments({ status: "rejected" }),
      User.countDocuments(),
      User.countDocuments({ role: "researcher" }),
      User.countDocuments({ role: "reviewer" })
    ]);

    res.json({
      proposals: {
        total: totalProposals,
        approved,
        underReview,
        revisionRequired,
        rejected
      },
      users: {
        total: totalUsers,
        researchers: totalResearchers,
        reviewers: totalReviewers
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load admin dashboard data"
    });
  }
};