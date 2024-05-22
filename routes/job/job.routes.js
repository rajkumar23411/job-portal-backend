import {
    applyToJob,
    getJobApplications,
} from "../../controllers/application/application.controller.js";
import {
    addRemoveJobToBookmark,
    getAllJobs,
    getJobsAsPerPreference,
    loadBookMarks,
    loadSingleJob,
} from "../../controllers/job/job.controller.js";
import auth from "./../../middlewares/auth.js";

import express from "express";
const jobRoutes = express.Router();

jobRoutes.get("/all", getAllJobs);

jobRoutes.use(auth);
jobRoutes.post("/bookmark/:id", addRemoveJobToBookmark);
jobRoutes.get("/my/bookmarks", loadBookMarks);
jobRoutes.get("/details/:id", loadSingleJob);
jobRoutes.post("/apply/:jobId", applyToJob);
jobRoutes.get("/preference", getJobsAsPerPreference);
jobRoutes.get("/applications/:jobId", getJobApplications);

export default jobRoutes;
