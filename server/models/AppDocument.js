import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ["Administrative Documents", "Protocol Documents", "Clinical Trial Specific"] 
  },
  subCategory: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  // Keep title/description as optional to avoid breaking existing data immediately if any, 
  // but they won't be used for new uploads.
  title: { type: String },
  description: { type: String }
});

export default mongoose.model("AppDocument", documentSchema);
