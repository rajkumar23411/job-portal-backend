import { body } from "express-validator";

export const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .length({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number"),
    body("role").isIn(["user", "admin"]).withMessage("Invalid role"),
    body("avatar").custom((value, { req }) => {
        if (req.file) {
            return true;
        } else {
            throw new Error("Avatar is required");
        }
    }),
    body("resume").custom((value, { req }) => {
        if (req.file) {
            return true;
        } else {
            throw new Error("Resume is required");
        }
    }),
];
