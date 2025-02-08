import express from "express";
import {
  deleteJob,
  completeJob,
  getAllJobs,
  getMyJobs,
  getSingleJob,
  postJob,
  updateJob,
  getCompletedJobs,
  getAssignedJobs,
} from "../controllers/jobController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getall", getAllJobs);
router.get("/getCompletedJobs",isAuthenticated, getCompletedJobs);
router.get("/getAssignedJobs",isAuthenticated, getAssignedJobs);
router.post("/post", isAuthenticated, postJob);
router.get("/getmyjobs", isAuthenticated, getMyJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);
router.put("/complete/:id", isAuthenticated, completeJob);
router.get("/:id", isAuthenticated, getSingleJob);

export default router;
