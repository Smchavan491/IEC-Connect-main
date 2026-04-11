import Proposal from "../models/Proposal.js";

export const approvedProposals = async (req, res) => {
  try {
    const approvedProposals = await Proposal.find({ status: "approved" })
      .populate({ path: "researcher", select: "name", model: "User" });
    res.status(200).json({ approvedProposals });
  }
  catch (error) {
    res.status(500).json({
      message: "Failed to load approved proposals"
    });
  }
};  