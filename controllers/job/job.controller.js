import TryCatch from "./../../utils/TryCatch.js";
import Bookmark from "../../models/bookmark.js";
import Job from "../../models/job.js";
import CustomErrorHanlder from "../../utils/CustomErrorHandler.js";
import Features from "../../utils/Features.js";

export const getAllJobs = TryCatch(async (req, res, next) => {
    const features = new Features(
        Job.find().populate("company"),
        req.query
    ).filter();
    let jobs = await features.query;

    res.status(200).json({
        success: true,
        jobs,
    });
});

export const addRemoveJobToBookmark = TryCatch(async (req, res, next) => {
    //  check job id provided or not
    // check the job id provided is valid or not
    // check user have bookmark or not
    // check the job id provided is already exisits in bookmark or not
    // if exisits then remove
    // if not exisits then add

    const { id } = req.params;

    if (!id) {
        return next(CustomErrorHanlder.required("Please provide the job id"));
    }

    const job = await Job.findById(id);

    if (!job) {
        return next(CustomErrorHanlder.notFound("Job not found"));
    }

    let bookmark = await Bookmark.findOne({ user: req.user });

    if (!bookmark) {
        bookmark = new Bookmark({
            user: req.user,
            jobs: [],
        });
    }
    const isJobExists = bookmark.jobs.findIndex((job) => job.toString() === id);

    if (isJobExists !== -1) {
        bookmark.jobs = bookmark.jobs.filter((job) => job.toString() !== id);
        await bookmark.save();
        return res.status(200).json({
            success: true,
            message: "Job removed from bookmark",
        });
    }

    bookmark.jobs.push(id);

    await bookmark.save();

    res.status(200).json({
        success: true,
        message: "Job added to bookmark",
    });
});

export const loadBookMarks = TryCatch(async (req, res, next) => {
    let bookmarks = await Bookmark.findOne({ user: req.user })
        .populate({
            path: "jobs",
            populate: {
                path: "company",
            },
        })
        .select("-createdAt -updatedAt -__v -user");

    res.status(200).json({
        success: true,
        bookmarks,
    });
});

export const loadSingleJob = TryCatch(async (req, res, next) => {
    const job = await Job.findById(req.params.id).populate("company");

    res.status(200).json({
        success: true,
        job,
    });
});
