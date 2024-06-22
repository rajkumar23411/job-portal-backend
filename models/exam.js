import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        candidate: {
            type: String,
            required: true,
        },
        marks: {
            type: Number,
        },
        accessKey: String,
        accessKeyExpiry: Date,
        startTime: Date,
        duration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: [
                "assigned",
                "validated",
                "appeared",
                `didn't appeared`,
                "left",
            ],
            default: "assigned",
        },
        validatedAt: Date,
        leftAt: Date,
        questionSets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        submittedAnswers: [
            {
                setId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                },
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question",
                },
                answer: {
                    type: Number,
                },
            },
        ],
        submittedAt: Date,
    },
    { timestamps: true }
);
// check if accessKey expired and status !== 'validated' then set status = "didn't appeared"
examSchema.pre("save", function (next) {
    if (this.accessKey && this.accessKeyExpiry) {
        const currentDateTime = new Date();
        if (
            currentDateTime > this.accessKeyExpiry &&
            this.status !== "appeared" &&
            this.status !== "left"
        ) {
            this.status = "didn't appeared";
        }
    }
    next();
});

export default mongoose.model("Exam", examSchema);
