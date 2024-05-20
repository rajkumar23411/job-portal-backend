import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["applied", "shortlisted", "interview", "rejected", "hired"],
        default: "applied",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Application", applicationSchema);
