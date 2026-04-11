import Proposal from "../models/Proposal.js";
import User from "../models/User.js";

/* ================= GET SCRUTINY DASHBOARD ================= */
export const getScrutinyDashboard = async (req, res) => {
    try {
        const scrutinyId = req.user.id;

        // Proposals assigned to scrutiny (status: admin_verified)
        const pendingProposals = await Proposal.find({
            status: "admin_verified"
            // In the singleton model, we might not assume direct 'assignedTo' for scrutiny if we just use status.
            // But for consistency, let's assume Admin explicitly assigned it OR 
            // the system auto-assigned it. The status 'admin_verified' implies it's ready for Scrutiny.
        })
            .select("title status createdAt researcher")
            .populate("researcher", "name email shortCode")
            .sort({ createdAt: -1 });

        const processedProposals = await Proposal.find({
            // Scrutiny has touched these? 
            // Logic: Status is beyond 'admin_verified' => 'scrutiny_verified', 'under_review', etc.
            // This is tricky without an explicit history log.
            // For now, let's just show pending.
            status: { $in: ["scrutiny_verified", "under_review", "approved", "rejected", "revision_required"] }
        }).countDocuments(); // Just a count for stats maybe?


        res.json({
            pending: pendingProposals,
            stats: {
                pendingCount: pendingProposals.length
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch dashboard" });
    }
};

/* ================= SCRUTINY ACTION ================= */
export const scrutinyAction = async (req, res) => {
    try {
        const { id } = req.params;
        const { decision, comments } = req.body; // decision: "approve" | "reject"

        const proposal = await Proposal.findById(id);
        if (!proposal) return res.status(404).json({ message: "Proposal not found" });

        if (proposal.status !== "admin_verified") {
            return res.status(400).json({ message: "Proposal is not pending scrutiny" });
        }

        if (decision === "approve") {
            proposal.status = "scrutiny_verified";
            // Auto-assign to REVIEWER role if single account exists?
            const reviewers = await User.find({ role: "reviewer" });
            if (reviewers.length > 0) {
                proposal.assignedTo = reviewers.map(r => r._id);
                proposal.reviewers = reviewers.map(r => r._id); // legacy support
                proposal.status = "under_review"; // Skip explicit 'scrutiny_verified' status if we auto-assign? 
                // Or keep it 'scrutiny_verified' and let Admin assign?
                // User said: "if accpts it will be assigned to reviewer"
                // "as there will be one account for each roles... it will directly get assigned"
                // So we auto-transition to under_review and assign to ALL reviewers (since there is one).
            } else {
                // If no reviewer found, maybe keep at 'scrutiny_verified' waiting for admin intervention?
                // But prompt implies automation.
                proposal.status = "scrutiny_verified";
            }
        } else if (decision === "reject") {
            proposal.status = "revision_required";
            proposal.comments.push({
                reviewer: req.user.id, // Scrutiny user
                text: comments || "Rejected by Scrutiny Committee",
                decision: "revision_required",
                createdAt: new Date()
            });
        } else {
            return res.status(400).json({ message: "Invalid decision" });
        }

        await proposal.save();
        res.json({ message: "Action submitted successfully", proposal });

    } catch (error) {
        res.status(500).json({ message: "Action failed", error: error.message });
    }
};
