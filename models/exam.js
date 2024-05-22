import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        questionSet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        duration: {
            type: Number,
            default: 0,
        },
        submissionTime: {
            type: Date,
            default: Date.now,
        },
        score: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
