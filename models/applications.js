import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["applied", "shortlist", "reject", "hire"],
        default: "applied",
    },
    examStatus: {
        type: String,
        enum: ["Not assigned", "Assigned", "Appeared", "Completed"],
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Application", applicationSchema);
