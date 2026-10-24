import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    repoUsernames: { type: [String], trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, default: null, select: false },
    googleId: { type: String, default: null },
    avatar: { type: String, default: null, trim: true },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    verificationToken: { type: String, default: null, trim: true },
    verificationExpiresAt: { type: Date, default: null },
    authProvider: { type: [String], enum: ["local", "google"] },
    role: {
      type: String,
      lowercase: true,
      enum: ["client", "admin"],
      default: "client",
    },
    plan: { type: String, lowercase: true, enum: ["free", "premium"] },
    planExpiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("Result", userSchema);
