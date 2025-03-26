import express from "express";
import { connectDb } from "./lib/db.js";
import config from "./config/index.js";
import router from "./router/index.js";
import dotenv from "dotenv";
import globalErrorHandler from "./middleware/global-error-hander.js";
import notFound from "./middleware/not-found.js";

const app= express();
dotenv.config();

app.use(express.json());

app.use("/api",router);


app.listen(config.port,()=>{
    console.log(`Server running on port ${config.port}`);
    connectDb();
});

app.use(globalErrorHandler);


app.use(notFound);


export default app;

