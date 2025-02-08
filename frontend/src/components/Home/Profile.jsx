import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Profile = () => {
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isAuthorized:", isAuthorized);
    if (!isAuthorized) {
      console.log("Navigating to /");
      navigate("/");
    }
  }, [isAuthorized, navigate]);

  return (
    <section className="jobDetail page">
      <div className="flex flex-col">
        <h3 className="flex justify-center items-center">User Details</h3>
        <div className="h-full m-20">
          <p className="m-6">Name: {user.name}</p>
          <p className="m-6">Email: {user.email}</p>
          <p className="m-6">Role: {user.role}</p>
          <p className="m-6">Phone Number: {user.phone}</p>
        </div>
      </div>
    </section>
  );
};

export default Profile;
