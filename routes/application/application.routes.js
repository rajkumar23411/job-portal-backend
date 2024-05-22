import express from "express";
import {
    getMyApplications,
    updateApplicationStatus,
} from "../../controllers/application/application.controller.js";
import auth from "./../../middlewares/auth.js";
const applicationRoutes = express.Router();

applicationRoutes.use(auth);
applicationRoutes.get("/my", getMyApplications);
applicationRoutes.put("/status/:applicationId", updateApplicationStatus);

export default applicationRoutes;
