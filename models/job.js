import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        skills: {
            type: [String],
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        responsibilities: {
            type: [String],
            required: true,
        },
        locations: {
            type: [String],
            required: true,
        },
        totalOpenings: {
            type: Number,
            required: true,
        },
        minSalary: {
            type: Number,
            required: true,
        },
        maxSalary: {
            type: Number,
            required: true,
        },
        jobType: {
            type: String,
            required: true,
            enum: ["full time", "part time", "contractual"],
        },
        workMode: {
            type: String,
            required: true,
            enum: ["remote", "onsite", "hybrid"],
        },
        profile: {
            type: [String],
            required: true,
        },
        status: {
            type: String,
            default: "Open",
        },
        totalApplicants: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
