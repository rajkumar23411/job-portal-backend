import express from "express";
import auth from "./../../middlewares/auth.js";
import {
    appearExam,
    assignExam,
    getAllAssignedExams,
    leftExam,
    loadCandidate,
    submitAnswers,
    validateExamURL,
} from "../../controllers/exam/exam.controller.js";
import authCandidate from "../../middlewares/verifyExamSession.js";

const examRoutes = express.Router();

examRoutes.post("/assign", auth, assignExam);
examRoutes.get("/company/all", auth, getAllAssignedExams);

examRoutes.get("/validate-access", validateExamURL);
examRoutes.get("/appear", authCandidate, appearExam);
examRoutes.get("/candidate/load", authCandidate, loadCandidate);
examRoutes.post("/submit", authCandidate, submitAnswers);
examRoutes.get("/left", authCandidate, leftExam);
export default examRoutes;
