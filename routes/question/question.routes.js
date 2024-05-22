import express from "express";
import {
    createQuestionSet,
    getQuestionSets,
    getSingleQuestionSet,
} from "../../controllers/question/question.controller.js";
import auth from "./../../middlewares/auth.js";

const questionRoutes = express.Router();

questionRoutes.use(auth);
questionRoutes.post("/create", createQuestionSet);
questionRoutes.get("/sets/load", getQuestionSets);
questionRoutes.get("/set/load/:id", getSingleQuestionSet);

export default questionRoutes;
