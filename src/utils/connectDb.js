import mongoose from "mongoose";
const { MONGODB_URI } = process.env;

const connectDb = async () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("Error durinf DB conn: ", err.message));
  return mongoose.connection.getClient();
};

export default connectDb;
