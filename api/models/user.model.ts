import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
