import React, { useEffect } from "react";
import { logoutUser } from "../../store/thunks/authThunks";
import { useDispatch } from "react-redux";
import useAuthState from "../../hooks/useAuthSlice";
import {  useNavigate } from "react-router-dom";
import { routes } from "../../App";

const Logout = () => {
  const { isAuthenticated } = useAuthState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(logoutUser(false));
    }

    const timeOutId = setTimeout(() => {
      navigate(routes.login, { replace: true });
    }, 5000);
    return () => clearTimeout(timeOutId); //clear timeout
  }, [navigate,dispatch,isAuthenticated]);
  return (
    <div>
      <h1>This page will redirect in 5 seconds</h1>
      <p>Redirecting to home</p>
    </div>
  );
};

export default Logout;
