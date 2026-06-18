import Proposal from "../models/Proposal.js";
import User from "../models/User.js";

// WARNING: This permanently deletes all proposals (and optionally users) from the database.
// Use only in a development/test environment or when you really want to start fresh.
export const clearAllData = async (req, res) => {
  try {
    // Delete all proposal documents
    await Proposal.deleteMany({});
    // Optionally, you could also clear users except admin accounts if desired.
    // await User.deleteMany({ role: { $ne: "admin" } });
    res.json({ message: "All data cleared successfully" });
  } catch (err) {
    console.error("Data clearance failed:", err);
    res.status(500).json({ message: "Failed to clear data", error: err.message });
  }
};
