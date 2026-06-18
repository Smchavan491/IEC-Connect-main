import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    qualification: { type: String, required: true },
    department: { type: String, required: true },
    subDepartment: { type: String },
    institution: { type: String, required: true },
    contact: { type: String },
    email: { type: String, required: true, match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"] },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["researcher", "reviewer", "admin", "scrutiny"],
      default: "researcher"
    },
    shortCode: { type: String, unique: true, sparse: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
