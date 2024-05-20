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
