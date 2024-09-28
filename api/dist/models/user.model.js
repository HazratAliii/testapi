"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    givenName: {
        type: String,
        required: true,
    },
    familyName: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    googleId: {
        type: String,
    },
    verificationToken: { type: String },
    tokenExpiration: { type: Date },
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
