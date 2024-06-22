import TryCatch from "./../../utils/TryCatch.js";
import CustomErrorHanlder from "./../../utils/CustomErrorHandler.js";
import Job from "./../../models/job.js";
import Application from "../../models/applications.js";
import Features from "../../utils/Features.js";
import sendMail from "./../../services/sendMail.js";
import User from "../../models/user.js";

export const applyToJob = TryCatch(async (req, res, next) => {
    const { jobId } = req.params;

    if (!jobId) {
        return next(CustomErrorHanlder.badRequest("Job id is required"));
    }

    const job = await Job.findById(jobId).populate("company", "name");

    if (!job) {
        return next(CustomErrorHanlder.badRequest("Job not found"));
    }

    // check user already applied or not
    const alreadyApplied = await Application.findOne({
        user: req.user,
        job: jobId,
    });

    if (alreadyApplied) {
        return next(
            CustomErrorHanlder.badRequest("Already applied for this job")
        );
    }
    job.totalApplicants += 1;

    await job.save();

    const user = await User.findById(req.user);

    const application = await Application.create({
        user: req.user,
        job: jobId,
    });
    const message = `Hello ${user.name}, your application for ${job.title} has been sent to ${job?.company.name}. We will get back to you shortly with further updates. Thank you for applying.`;
    await sendMail({
        email: user.email,
        subject: "Application status update",
        message,
    });

    res.status(200).json({
        success: true,
        message: "Applied successfully",
    });
});

export const getMyApplications = TryCatch(async (req, res, next) => {
    if (!req.user) {
        return next(CustomErrorHanlder.badRequest("Please login to access"));
    }

    const applications = await Application.find({ user: req.user })
        .populate({
            path: "job",
            populate: {
                path: "company",
                select: "name",
            },
        })
        .populate("user");

    res.status(200).json({
        success: true,
        applications,
    });
});

// single job application
export const getJobApplications = TryCatch(async (req, res, next) => {
    const { jobId } = req.params;

    if (!jobId) {
        return next(CustomErrorHanlder.badRequest("Job id is required"));
    }

    const features = new Features(
        Application.find({ job: jobId })
            .populate("user", "name email contact resume date")
            .populate("job", "title profile createdAt"),
        req.query
    );
    const applications = await features.query;
    res.status(200).json({
        success: true,
        applications,
    });
});

// job avalibale job applications
export const getAllJobApplications = TryCatch(async (req, res, next) => {
    const features = new Features(
        Application.find()
            .populate("user", "name email contact resume date")
            .populate("job", "title profile createdAt"),
        req.query
    ).filter();
    const applications = await features.query;

    res.status(200).json({
        success: true,
        applications,
    });
});

export const updateApplicationStatus = TryCatch(async (req, res, next) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!applicationId) {
        return next(
            CustomErrorHanlder.badRequest("Application id is required")
        );
    }

    if (!status) {
        return next(CustomErrorHanlder.badRequest("Status is required"));
    }

    const application = await Application.findById(applicationId)
        .populate("job", "title")
        .populate({
            path: "job",
            populate: {
                path: "company",
                select: "name",
            },
        });

    if (!application) {
        return next(CustomErrorHanlder.badRequest("Application not found"));
    }

    if (application.status === "rejected" || application.status === "hired") {
        return next(
            CustomErrorHanlder.badRequest("Application already processed")
        );
    }
    if (status === "shortlist") {
        application.examStatus = "Not assigned";
    }
    application.status = status;
    await application.save();

    res.status(200).json({
        success: true,
        message: "Status updated",
    });
});
