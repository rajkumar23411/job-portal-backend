import mongoose from "mongoose";
import bcrypt from "bcrypt";
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    RegdNo: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    website: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    totalEmployee: {
        type: Number,
        require: true,
    },
    role: {
        type: String,
        default: "company",
    },
});
companySchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
});

companySchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Company", companySchema);
