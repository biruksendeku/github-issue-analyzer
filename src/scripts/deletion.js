import mongoose from "mongoose";
import User from "../models/user.js";
import Result from "../models/result.js";

// deleting client
// Client.findByIdAndDelete("6a8573ada112394e4c7aea75")
//   .then(() => console.log("Client deleted"))
//   .catch((err) => console.error("Failed to delete client: ", err));

// mass deletion
User.deleteMany().catch((err) =>
  console.error("Failed to delete users: ", err),
);

Result.deleteMany().catch((err) =>
  console.error("Failed to delete results: ", err),
);

// mongoose.connection
//   .collection("sessions")
//   .deleteMany()
//   .catch((err) => console.error("Failed to delete sessions: ", err));
