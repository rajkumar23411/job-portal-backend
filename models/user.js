import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        gender: {
            type: String,
        },
        languageKnown: [
            {
                type: String,
            },
        ],
        careerPreference: [
            {
                type: String,
            },
        ],
        workPreference: [
            {
                type: String,
            },
        ],
        city: { type: String },
        contact: { type: String },
        role: {
            type: String,
            default: "user",
        },
        avatar: {
            public_id: { type: String, select: false },
            url: { type: String },
        },
        resume: {
            orgFileName: { type: String },
            public_id: { type: String, select: false },
            url: { type: String },
            uploadedOn: { type: Date, default: Date.now() },
        },
        isAccountVerified: {
            type: Boolean,
            default: false,
        },
        code: {
            type: String || Number,
            select: false,
        },
        codeExp: {
            type: Date,
            select: false,
        },
        token: {
            type: String,
            select: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
