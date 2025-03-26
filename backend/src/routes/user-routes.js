import express from "express";
import { UserController } from "../controllers/user-controllers.js";

const router= express.Router();



router.post("/login",UserController.createUser);

router.post("/register", async(req,res)=>{

    // TODO: Implement login logic
});



export default router;