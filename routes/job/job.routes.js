import { applyToJob } from "../../controllers/application/application.controller.js";
import {
    addRemoveJobToBookmark,
    getAllJobs,
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

export default jobRoutes;
