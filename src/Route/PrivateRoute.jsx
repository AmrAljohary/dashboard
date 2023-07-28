import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import api from "../Store/api";
import { useDispatch } from "react-redux";
import { clearUserData } from "../Store/reducers/auth";

const PrivateRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const login = JSON.parse(localStorage.getItem("login"));
  const [authenticated, setAuthenticated] = useState(false);
  const [expTime, setExpTime] = useState(null);
  const [alreadyNavigated, setAlreadyNavigated] = useState(false); 
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTokenStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        axios
          .get(`${api.defaults.baseURL}/admin/checkToken`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            setAuthenticated(true);
            const { exp } = response.data;
            setExpTime(exp * 1000); // Convert to milliseconds
          })
          .catch((error) => {
            setAuthenticated(false);
            // Clear data from local storage
            localStorage.removeItem("profileURL");
            localStorage.removeItem("UserName");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("login");
            // Clear data from Redux store (you may replace clearUserData with your actual action)
            dispatch(clearUserData());
            if (!alreadyNavigated) {
              // Navigate to login page after a delay to allow time to delete items from localStorage
              setTimeout(() => {
                navigate(`${process.env.PUBLIC_URL}/login`, { replace: true });
              }, 1000); // Adjust the delay as needed
              setAlreadyNavigated(true);
            }
          });
      } else {
        setAuthenticated(false);
      }
    };

    // Fetch token status when the component mounts
    fetchTokenStatus();

    // Check token expiration every 1-2 seconds (you can adjust the interval as needed)
    const interval = setInterval(fetchTokenStatus, 60 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [alreadyNavigated, dispatch, navigate]);

  return login || authenticated || accessToken ? (
    <Outlet />
  ) : (
    <Navigate exact to={`${process.env.PUBLIC_URL}/login`} />
  );
};

export default PrivateRoute;
