import mongoose from "mongoose";

const contactQuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Replied"], default: "Pending" },
  reply: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ContactQuery", contactQuerySchema);
