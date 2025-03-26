import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/user-routes.js";
import { connectDb } from "./lib/db.js";
import config from "./config/index.js";

const app= express();
dotenv.config();

const PORT= process.env.PORT || 4000;



app.use(express.json());

app.use("/api/auth",authRoutes);

app.listen(config.port,()=>{
    console.log(`Server running on port ${PORT}`);
    connectDb();
})
