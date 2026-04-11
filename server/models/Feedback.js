import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);
