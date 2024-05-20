import express from "express";
import {
    createJob,
    deleteJob,
    loadAllJobs,
    loadCompany,
    loadSingleJob,
    login,
    logout,
    register,
    updateJob,
} from "./../../controllers/company/company.controller.js";
import upload from "./../../middlewares/multer.js";
import auth from "./../../middlewares/auth.js";

const companyRoutes = express.Router();

companyRoutes.post("/register", upload.single("file"), register);
companyRoutes.post("/login", login);

companyRoutes.use(auth);

companyRoutes.post("/load", loadCompany);
companyRoutes.post("/job/create", createJob);
companyRoutes.put("/job/update/:id", updateJob);
companyRoutes.delete("/job/delete/:id", deleteJob);
companyRoutes.get("/jobs", loadAllJobs);
companyRoutes.get("/job/:id", loadSingleJob);
companyRoutes.get("/logout", logout);

export default companyRoutes;
