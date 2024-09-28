"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.signin = exports.verifyEmail = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, givenName, familyName, language } = req.body;
        const userExists = yield user_model_1.default.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
        const newUser = new user_model_1.default({
            email,
            password: hashedPassword,
            givenName,
            familyName,
            language,
            verificationToken,
            tokenExpiration: Date.now() + 3600000,
        });
        yield newUser.save();
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Email Verification",
            text: `Please verify your email by clicking on the following link: 
      http://localhost:${process.env.PORT}/api/v1/auth/verify/${verificationToken}`,
        };
        yield transporter.sendMail(mailOptions);
        return res.status(201).json({
            message: "User created successfully. Please check your email to verify your account.",
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
});
exports.signup = signup;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("I got hitted");
    const { token } = req.params;
    try {
        const user = yield user_model_1.default.findOne({
            verificationToken: token,
            tokenExpiration: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        user.verified = true;
        user.verificationToken = undefined;
        user.tokenExpiration = undefined;
        yield user.save();
        return res.status(200).json({ message: "Email verified successfully!" });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
});
exports.verifyEmail = verifyEmail;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!user.verified) {
            return res.status(403).json({
                message: "Please verify your email before logging in",
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "5h" });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
            maxAge: 5 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login successful",
            token,
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
});
exports.signin = signin;
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    // clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientID: "25575199037-sahspmmgemqdt93lgblf224t1ki14un0.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:5000/api/v1/auth/google/callback", // This URL should match the one you set in the Google Developers Console
    scope: ["profile", "email"],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Check if user already exists in the database
        const existingUser = yield user_model_1.default.findOne({
            email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
        });
        if (existingUser) {
            // User already exists, log them in
            return done(null, existingUser);
        }
        // If user doesn't exist, create a new one
        const newUser = new user_model_1.default({
            email: (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0].value,
            givenName: (_c = profile.name) === null || _c === void 0 ? void 0 : _c.givenName,
            familyName: (_d = profile.name) === null || _d === void 0 ? void 0 : _d.familyName,
            googleId: profile.id,
            verified: true, // Google accounts are already verified
        });
        yield newUser.save();
        return done(null, newUser);
    }
    catch (err) {
        // @ts-ignore
        return done(err, null);
    }
})));
// Serialize and deserialize user (for maintaining sessions)
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
const googleAuth = (req, res) => {
    const user = req.user; // The user is added to req.user by Passport
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "5h" });
    // Set token as cookie
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 5 * 60 * 60 * 1000, // 5 hours
    });
    // Redirect or send success response
    res.redirect("http://localhost:3000");
};
exports.googleAuth = googleAuth;
