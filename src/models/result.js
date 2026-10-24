import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Reference user is required"],
  },
  latestRepo: { type: String, trim: true },
});

export default mongoose.model("Result", resultSchema);
