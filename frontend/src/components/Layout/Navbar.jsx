import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message), setIsAuthorized(true);
    }
  };

  return (
    <>
    <nav className={isAuthorized ? "navbarShow bg-black" : "navbarHide"} >
      <div className="container" onClick={showUserMenu ? () => setShowUserMenu(false) : undefined}>
        <div className="" onClick={()=>setShowUserMenu(false)}>
          <img src="/white_logo.png" alt="logo" className="h-20 w-auto "/>
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <Link to={"/"} onClick={() => {setShow(false);setShowUserMenu(false);}}>
              HOME
            </Link>
          </li>
          <li>
            <Link to={"/job/getall"} onClick={() => {setShow(false);setShowUserMenu(false);}}>
              ALL JOBS
            </Link>
          </li>
          
          <li className="user-icon text-9xl" onClick={() => setShowUserMenu(!showUserMenu)}>
          <FaCircleUser className="relative text-5xl text-white" />

            
          </li>
          
        </ul>
        
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
    </nav>
    {showUserMenu && (
              <div className="flex flex-col absolute top-24 right-10 w-60 justify-center items-end rounded-md bg-slate-100">
                <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}><Link to={"/profile"}>Profile</Link></div><hr className="w-full"/>
                <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                  
                </div><hr className="w-full"/>
                {user && user.role === "Client" ? (
                  <>
                    <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                      <Link to={"/applications/me"}>FREELANCER'S APPLICATIONS</Link>
                    </div><hr className="w-full"/>
                    <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                      <Link to={"/job/post"}>POST NEW JOB</Link>
                    </div><hr className="w-full"/>
                    <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                      <Link to={"/job/me"} className="text-decoration-none">VIEW YOUR JOBS</Link>
                    </div><hr className="w-full"/>
                    <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                      <Link to={"/job/assigned"} className="text-decoration-none">ASSIGNED JOBS</Link>
                    </div><hr className="w-full"/>
                    <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                      <Link to={"/job/completed"} className="text-decoration-none">COMPLETED JOBS</Link>
                    </div><hr className="w-full"/>
                  </>
                ): <>
                <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                  <Link to={"/applications/me"}>MY APPLICATIONS</Link>
                </div><hr className="w-full"/>
                <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                  <Link to={"/job/assigned"}>ASSIGNED JOBS</Link>
                </div><hr className="w-full"/>
                <div className="px-2 py-0.5" onClick={()=>setShowUserMenu(false)}>
                  <Link to={"/job/completed"} className="text-decoration-none">COMPLETED JOBS</Link>
                </div><hr className="w-full"/>
              </>}
                <div onClick={()=>{
                  setShowUserMenu(false);
                  handleLogout();
                }} className="px-2 py-0.5">Logout</div>
              </div>
            )}
    </>
  );
};

export default Navbar;
