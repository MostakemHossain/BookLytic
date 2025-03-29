import mongoose from "mongoose";
import config from "../config/index.js";

export const connectDb = async () => {
    try {
        await mongoose.connect(config.database_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB connected successfully");
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB Connection Error:", err);
            process.exit(1);
        });

    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
