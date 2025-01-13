import mongoose from "mongoose";
import dotenv from "dotenv";
import { mongo_url } from "../utils/swamhtet.js";

dotenv.config();

const MONGO_DB_URL = mongo_url;
const connectToMongoDB = async () => {
  try {

    await mongoose.connect(MONGO_DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToMongoDB;