import CustomErrorHanlder from "../utils/CustomErrorHandler.js";
import jwt from "jsonwebtoken";

const authCandidate = (req, res, next) => {
    const { exam_token } = req.cookies;

    if (!exam_token) {
        return next(CustomErrorHanlder.unAuthorized());
    }

    const data = jwt.verify(exam_token, process.env.JWT_SECRET);

    if (!data) {
        return next(CustomErrorHanlder.unAuthorized());
    }

    req.exam = data._id;

    next();
};

export default authCandidate;
