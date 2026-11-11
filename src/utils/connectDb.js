import mongoose from "mongoose";
const { MONGODB_URI } = process.env;

const connectDb = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log("DB connected");
  return mongoose.connection.getClient();
};

export default connectDb;
