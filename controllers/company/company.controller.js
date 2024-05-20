import TryCatch from "./../../utils/TryCatch.js";
import CustomErrorHanlder from "./../../utils/CustomErrorHandler.js";
import cloudinaryServices from "./../../utils/cloudinary.js";
import Company from "../../models/company.js";
import sendToken from "./../../utils/token.js";
import Job from "../../models/job.js";

export const register = TryCatch(async (req, res, next) => {
    const {
        name,
        RegdNo,
        email,
        password,
        description,
        totalEmployee,
        website,
    } = req.body;

    if (
        !name ||
        !RegdNo ||
        !email ||
        !password ||
        !description ||
        !website ||
        !totalEmployee
    ) {
        return next(CustomErrorHanlder.required("All fields are required"));
    }

    const filePath = req.file.path;

    if (!filePath) {
        return next(CustomErrorHanlder.required("Logo is required"));
    }

    const { public_id, url } = await cloudinaryServices.upload(filePath);

    const company = await Company.create({
        name,
        RegdNo,
        email,
        password,
        description,
        totalEmployee,
        website,
        logo: {
            public_id,
            url,
        },
    });

    sendToken(res, company, 201, "Company registered successfully", 2);
});

export const login = TryCatch(async (req, res, next) => {
    const { RegdNo, password, rememberMe } = req.body;

    if (!RegdNo || !password) {
        return next(CustomErrorHanlder.required("All fields are required"));
    }

    const company = await Company.findOne({ RegdNo }).select("+password");

    if (!company) {
        return next(CustomErrorHanlder.badRequest("Invalid credentials"));
    }

    const isMatch = await company.matchPassword(password);

    if (!isMatch) {
        return next(CustomErrorHanlder.badRequest("Invalid credentials"));
    }
    sendToken(res, company, 200, "Login successful", 2);
});

export const loadCompany = TryCatch(async (req, res, next) => {
    const company = await Company.findById(req.user);

    if (!company) {
        return next(CustomErrorHanlder.badRequest("Company not found"));
    }

    res.status(200).json({
        success: true,
        company,
    });
});

export const createJob = TryCatch(async (req, res, next) => {
    const company = await Company.findById(req.user);
    if (!company) {
        return next(CustomErrorHanlder.badRequest("Company not found"));
    }

    await Job.create({
        ...req.body,
        company: company._id,
    });

    res.status(200).json({
        success: true,
        message: "Job created successfully",
    });
});

export const updateJob = TryCatch(async (req, res, next) => {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!job) {
        return next(CustomErrorHanlder.badRequest("Job not found"));
    }

    res.status(200).json({
        success: true,
        message: "Job updated successfully",
    });
});

export const deleteJob = TryCatch(async (req, res, next) => {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
        return next(CustomErrorHanlder.badRequest("Job not found"));
    }

    res.status(200).json({
        success: true,
        message: "Job deleted successfully",
    });
});

export const loadAllJobs = TryCatch(async (req, res, next) => {
    const company = await Company.findById(req.user);
    if (!company) {
        return next(CustomErrorHanlder.badRequest("Company not found"));
    }

    const jobs = await Job.find({ company: company._id }).populate("company");

    if (!jobs) {
        return next(CustomErrorHanlder.badRequest("No jobs found"));
    }

    res.status(200).json({
        success: true,
        jobs,
    });
});

export const loadSingleJob = TryCatch(async (req, res, next) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return next(CustomErrorHanlder.badRequest("Job not found"));
    }

    res.status(200).json({
        success: true,
        job,
    });
});

export const logout = TryCatch(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        http: true,
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});
