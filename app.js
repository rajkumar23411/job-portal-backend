import express, { urlencoded } from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from "./routes/user/user.routes.js";
import companyRoutes from "./routes/company/company.routes.js";
import jobRoutes from "./routes/job/job.routes.js";
import applicationRoutes from "./routes/application/application.routes.js";
import questionRoutes from "./routes/question/question.routes.js";
import examRoutes from "./routes/exam/exam.routes.js";

// env file configuration
dotenv.config({ path: "./.env" });

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
// session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/exam", examRoutes);

// error handling middleware
app.use(errorHandler);

export default app;
