import userRoutes from "../routers/user-routes.js";
import express from "express";

const router = express.Router();
const moduleRoutes = [
    {
      path: '/auth',
      route: userRoutes
    },
    
  ];
  
  moduleRoutes.forEach((route) => router.use(route.path, route.route));
  export default router;
  