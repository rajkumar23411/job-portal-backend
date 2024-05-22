import TryCatch from "./../../utils/TryCatch.js";
import CustomErrorHanlder from "./../../utils/CustomErrorHandler.js";
import Job from "./../../models/job.js";
import Application from "../../models/applications.js";

export const applyToJob = TryCatch(async (req, res, next) => {
    const { jobId } = req.params;

    if (!jobId) {
        return next(CustomErrorHanlder.badRequest("Job id is required"));
    }

    const job = await Job.findById(jobId);

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

    await Application.create({
        user: req.user,
        job: jobId,
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

export const getJobApplications = TryCatch(async (req, res, next) => {
    const { jobId } = req.params;

    if (!jobId) {
        return next(CustomErrorHanlder.badRequest("Job id is required"));
    }

    const applications = await Application.find({ job: jobId })
        .populate("user", "name email contact resume date")
        .populate("job", "title profile createdAt");

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

    application.status = status;
    await application.save();

    res.status(200).json({
        success: true,
        message: "Status updated",
    });
});
