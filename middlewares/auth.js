import TryCatch from "../utils/TryCatch.js";
import CustomErrorHanlder from "../utils/CustomErrorHandler.js";
import jwt from "jsonwebtoken";
const auth = TryCatch(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(CustomErrorHanlder.unAuthorized());
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    if (!data) {
        return next(CustomErrorHanlder.unAuthorized());
    }

    req.user = data._id;

    next();
});

export default auth;
