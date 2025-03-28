import bookRoutes from "../routers/book-routes.js";
import userRoutes from "../routers/user-routes.js";
import express from "express";

const router = express.Router();
const moduleRoutes = [
    {
      path: '/auth',
      route: userRoutes
    },
    {
      path: '/book',
      route: bookRoutes
    }
    
  ];
  
  moduleRoutes.forEach((route) => router.use(route.path, route.route));
  export default router;
  