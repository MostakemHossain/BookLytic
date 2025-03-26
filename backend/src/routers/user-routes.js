import express from "express";
import { UserController } from "../controllers/user-controllers.js";
import validateRequest from "../middleware/validate-request.js";
import { UserValidations } from "../schema-validation/user-schema-validation.js";

const router= express.Router();

router.post("/register",validateRequest(UserValidations.createUserValidationSchema),UserController.createUser);

router.post("/login", async(req,res)=>{

    // TODO: Implement login logic
});


const userRoutes = router;
export default userRoutes;