import express from "express";
import {
  clientGetAllApplications,
  freelancerDeleteApplication,
  freelancerGetAllApplications,
  postApplication,
  ClientAcceptApplication,
  ClientRejectApplication,
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isAuthenticated, postApplication);
router.get("/client/getall", isAuthenticated, clientGetAllApplications);
router.get("/freelancer/getall", isAuthenticated, freelancerGetAllApplications);
router.delete("/delete/:id", isAuthenticated, freelancerDeleteApplication);
router.delete("/accept/:id", isAuthenticated, ClientAcceptApplication);
router.delete("/reject/:id", isAuthenticated, ClientRejectApplication);

export default router;
