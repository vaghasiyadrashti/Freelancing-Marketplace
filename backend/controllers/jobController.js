import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import { User} from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Fetch all jobs which are available
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ expired: false,status: "Posted" });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const getAssignedJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  const jobs = await Job.find({
    expired: false,
    status: "Assigned",
    $or: [
        { role: { $ne: "Client" }, assignedTo: req.user._id },
        { role: { $ne: "Freelancer" }, postedBy: req.user._id }
    ]
  });

  res.status(200).json({
    success: true,
    jobs,
  });
});

export const getCompletedJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  const jobs = await Job.find({
    expired: false,
    status: "Completed",
    $or: [
        { role: { $ne: "Client" }, assignedTo: req.user._id },
        { role: { $ne: "Freelancer" }, postedBy: req.user._id }
    ]
  });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Freelancer") {
    return next(
      new ErrorHandler("Freelancer not allowed to access this resource.", 400)
    );
  }
  const {
    title,
    description,
    category,
    country,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary.",
        400
      )
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    status: "Posted",
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});


export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Freelancer") {
    return next(
      new ErrorHandler("Freelancer not allowed to access this resource.", 400)
    );
  }
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Freelancer") {
    return next(
      new ErrorHandler("Freelancer not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;

  let job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Freelancer") {
    return next(
      new ErrorHandler("Freelancer not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

export const completeJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Freelancer") {
    return next(
      new ErrorHandler("Freelancer not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  await Job.findByIdAndUpdate(id, { status: "Completed" }, { new: true });

  res.status(200).json({
    success: true,
    message: "Job Completed!",
  });
});

export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const jobs = await Job.findById(id);
    if (!jobs) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    let freelancer = {};
    if (jobs.assignedTo) {
      freelancer = await User.findById(jobs.assignedTo);
    }
    
    const job=[jobs,freelancer];
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});
