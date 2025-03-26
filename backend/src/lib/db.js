import mongoose from "mongoose";
import config from "../config/index.js";

export const connectDb=async()=>{
    try {
        await mongoose.connect(config.database_url);
        console.log("MongoDB connected");
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}