import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    title: {
        type: String,
        required: true,
    },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: Number, required: true },
        },
    ],
});

export default mongoose.model("Question", questionSchema);
