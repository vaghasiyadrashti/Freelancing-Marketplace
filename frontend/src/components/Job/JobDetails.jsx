import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [freelancer, setFreelancer] = useState({});
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  // Function to handle marking a job as done
  const handleMarkAsDone = (jobId) => {
    console.log(jobId);
    axios
      .put(`http://localhost:4000/api/v1/job/complete/${jobId}`,{status:"Completed"} ,{ withCredentials: true })
      .then((res) => {
        // Optionally handle success, for example, show a success message
        toast.success("Job marked as done successfully!");
        // Optionally, update the job status in the local state if needed
        setJob({});
        navigateTo("/");
      })
      .catch((error) => {
        // Handle error, for example, show an error message
        toast.error("Failed to mark job as done.");
        console.error("Error marking job as done:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.job[0]);
        setJob(res.data.job[0]);
        setFreelancer(res.data.job[1]);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, []);

  if (!isAuthorized) {
    navigateTo("/login");
  }
  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span> {job.title}</span>
          </p>
          <p>
            Category: <span>{job.category}</span>
          </p>
          <p>
            Country: <span>{job.country}</span>
          </p>
          {/* <p>
            City: <span>{job.city}</span>
          </p>
          <p>
            Location: <span>{job.location}</span>
          </p> */}
          <p>
            Description: <span>{job.description}</span>
          </p>
          {
            job.assignedTo && <><p>
            Assigned To: <span>{freelancer.name}</span>
          </p>
            <p>
            Email of Freelancer: <span>{freelancer.email}</span>
          </p>
          </>
          }
          <p>
            Job Posted On: <span>{job.jobPostedOn}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary}</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo}
              </span>
            )}
          </p>
          {user && ( job.assignedTo || user.role === "Client" ? (
            <></>
          ) : (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          ))}
          {user && ( job.status==="Assigned" && user.role === "Client" ? (
           <div className="flex justify-center items-center bg-green-600 w-40 h-10 ">
           <button onClick={() => handleMarkAsDone(job._id)} className="text-1.5xl font-semibold text-slate-200">
             Mark As Done
           </button>
         </div>
          ) : (
            <></>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;