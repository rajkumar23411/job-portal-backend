import TryCatch from "./../../utils/TryCatch.js";
import CustomErrorHandler from "./../../utils/CustomErrorHandler.js";
import Exam from "../../models/exam.js";
import User from "../../models/user.js";
import sendMail from "./../../services/sendMail.js";
import Applications from "../../models/applications.js";
import Features from "./../../utils/Features.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Question from "../../models/question.js";

export const assignExam = TryCatch(async (req, res, next) => {
    const { candidate_id, jobPost, duration, questionSets } = req.body;

    if (!candidate_id || !questionSets || !duration || !jobPost) {
        return next(CustomErrorHandler.badRequest("All fields are required"));
    }

    const candidate = await User.findOne({ email: candidate_id });

    if (!candidate) {
        return next(CustomErrorHandler.badRequest("Candidate not found"));
    }

    const application = await Applications.findOne({
        user: candidate._id,
        job: jobPost,
    });

    if (!application) {
        return next(
            CustomErrorHandler.badRequest("Candidate not found in this job")
        );
    }

    if (application.status !== "shortlist") {
        return next(
            CustomErrorHandler.badRequest(
                "Cannot assign exam, candidate is not shortlisted"
            )
        );
    }

    const isExamAssigned = await Exam.findOne({
        candidate: candidate_id,
        job: jobPost,
    });

    if (isExamAssigned) {
        return next(
            CustomErrorHandler.badRequest("Exam already assigned to this user")
        );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiry

    await Exam.create({
        company: req.user,
        candidate: candidate_id,
        duration,
        questionSets,
        job: jobPost,
        accessKey: hashedToken,
        accessKeyExpiry: tokenExpiry,
    });

    const accessURL = `http://localhost:5173/exam/candidate/validate?token=${token}&auth=${candidate._id}`;

    const message = `Click the link below to appear for the initial screening test:\n\n${accessURL}\n\nIf you did not request this, please ignore it.`;

    await sendMail({
        email: candidate.email,
        subject: `Initial Screening Exam Access Key`,
        message: message,
    });

    res.status(200).json({
        success: true,
        message: "Exam assigned successfully",
    });
});

export const getAllAssignedExams = TryCatch(async (req, res, next) => {
    const features = new Features(
        Exam.find({ company: req.user }).populate("job", "title"),
        req.query
    ).filter();
    const exams = await features.query;

    res.status(200).json({
        success: true,
        exams,
    });
});

export const validateExamURL = TryCatch(async (req, res, next) => {
    const { token, auth } = req.query;

    if (!token || !auth) {
        return next(CustomErrorHandler.badRequest("Access token is missing"));
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const exam = await Exam.findOne({
        accessKey: hashedToken,
        accessKeyExpiry: { $gt: Date.now() },
    });

    if (!exam) {
        return next(
            CustomErrorHandler.badRequest(
                "Invalid access URL or URL has expired."
            )
        );
    }

    const currentTime = Date.now();
    if (
        exam.status === "validated" &&
        currentTime >
            new Date(exam.validatedAt).getTime() + exam.duration * 60 * 1000
    ) {
        return next(
            CustomErrorHandler.badRequest("You can't appear for this exam now!")
        );
    }

    if (exam.status !== "assigned") {
        return next(
            CustomErrorHandler.badRequest(
                "Exam is already validated or appeared"
            )
        );
    }

    const user = await User.findOne({ email: exam.candidate });

    if (!user) {
        return next(CustomErrorHandler.badRequest("User not found"));
    }

    const authToken = jwt.sign({ _id: exam._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    exam.status = "validated";
    exam.validatedAt = currentTime;

    await exam.save();

    // set a cookie
    res.status(200)
        .cookie("exam_token", authToken, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
        })
        .json({
            success: true,
            message: "Exam validated successfully",
            exam,
        });
});

export const appearExam = TryCatch(async (req, res, next) => {
    const exam = await Exam.findById(req.exam).populate(
        "job company questionSets"
    );

    if (!exam) {
        return next(CustomErrorHandler.badRequest("Exam not found"));
    }

    if (exam.status !== "validated") {
        return next(CustomErrorHandler.badRequest("Exam not validated"));
    }

    exam.status = "appeared";

    await exam.save();

    res.status(200).json({
        success: true,
        message: "Exam appeared successfully",
        exam,
    });
});

export const loadCandidate = TryCatch(async (req, res, next) => {
    const exam = await Exam.findById(req.exam).populate(
        "job company questionSets"
    );

    if (!exam) {
        return next(CustomErrorHandler.badRequest("Exam not found"));
    }

    res.status(200).json({
        success: true,
        exam,
    });
});

// Submit answers controller
export const submitAnswers = TryCatch(async (req, res, next) => {
    const { examId, answers } = req.body;

    // Fetch the exam details
    const exam = await Exam.findById(examId);
    if (!exam) {
        return next(CustomErrorHandler.notFound("Exam not found"));
    }

    let totalMarks = 0;

    // Validate and calculate marks for each answer
    const submittedAnswers = await Promise.all(
        answers.map(async ({ setId, questionId, answer }) => {
            const questionSet = await Question.findById(setId);
            if (!questionSet) {
                return null;
            }

            const question = questionSet.questions.find(
                (q) => q._id.toString() === questionId
            );
            console.log(question);
            if (!question) {
                return null;
            }

            const isCorrect = question.correctAnswer === answer;

            if (isCorrect) {
                totalMarks += 1; // Assuming 1 mark per correct answer
            }

            return {
                setId,
                questionId,
                answer,
            };
        })
    );

    // Filter out any invalid submissions
    const validSubmittedAnswers = submittedAnswers.filter(Boolean);

    // Update exam with submitted answers and total marks
    exam.submittedAnswers = validSubmittedAnswers;
    exam.marks = totalMarks;
    exam.submittedAt = new Date();
    exam.status = "appeared";

    exam.accessKey = undefined;
    exam.accessKeyExpiry = undefined;

    await exam.save();

    res.cookie("exam_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Answers submitted successfully",
        marks: totalMarks,
    });
});

export const leftExam = TryCatch(async (req, res, next) => {
    console.log(req.exam);
    const exam = await Exam.findById(req.exam);

    if (!exam) {
        return next(CustomErrorHandler.badRequest("Exam not found"));
    }

    exam.status = "left";
    exam.leftAt = new Date();
    exam.accessKey = undefined;
    exam.accessKeyExpiry = undefined;

    await exam.save();

    res.cookie("exam_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Exam left successfully",
    });
});
