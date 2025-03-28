import express from "express";
import validateRequest from "../middleware/validate-request.js";
import { BookValidations } from "../schema-validation/book-schema-validation.js";
import { BookController } from "../controllers/book-controllers.js";
import auth from "../middleware/auth.js";

const router= express.Router();

router.post("/create-book",validateRequest(BookValidations.createBookValidationSchema), auth('user'),BookController.createBook);

const bookRoutes = router;
export default bookRoutes;