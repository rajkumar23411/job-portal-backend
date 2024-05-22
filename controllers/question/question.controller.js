import Question from "../../models/question.js";
import TryCatch from "../../utils/TryCatch.js";

export const createQuestionSet = TryCatch(async (req, res, next) => {
    await Question.create({
        company: req.user,
        title: req.body.title,
        questions: req.body.questions,
    });

    res.status(200).json({
        success: true,
        message: "Question set created successfully",
    });
});

export const getQuestionSets = TryCatch(async (req, res, next) => {
    const questionSets = await Question.find({ company: req.user });

    res.status(200).json({
        success: true,
        questionSets,
    });
});

export const getSingleQuestionSet = TryCatch(async (req, res, next) => {
    const questionSet = await Question.findById(req.params.id);

    if (!questionSet) {
        return next(CustomErrorHanlder.badRequest("Question set not found"));
    }

    res.status(200).json({
        success: true,
        questionSet,
    });
});
