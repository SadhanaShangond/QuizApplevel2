import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../App";
import useAuthState from "../hooks/useAuthSlice";

const ProtectedRoutes = ({ element }) => {
  const { isAuthenticated } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(routes.login, { replace: true });
    }
  }, [navigate, isAuthenticated]);

  // While redirecting, you can show a loader or nothing
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        Redirecting...
      </div>
    );
  }

  return <>{element}</>;
};

export default ProtectedRoutes;
