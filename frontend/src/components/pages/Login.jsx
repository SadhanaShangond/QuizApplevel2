import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ import Link
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import useAuthState from "../../hooks/useAuthSlice";
import { useDispatch } from "react-redux";
import { loginAPI } from "../../store/thunks/authThunks";
import { routes } from "../../App";

const Login = () => {

  const { isAuthenticated, loading, error, email } = useAuthState();
  const navigate = useNavigate();
const dispatch = useDispatch();

useEffect(()=>{
  if(isAuthenticated){
   navigate(routes.protectedRoutes.welcome); 

  }
},[isAuthenticated,navigate])

  const validationSchema = useMemo(()=>{
    const schema = Yup.object().shape({
      email:Yup.string().trim().email("Invalid emailId").required("Email is required"),

      password:Yup.string().trim().required("Password is required"),
    })
    return schema;
  },[])

  const formik = useFormik({
    initialValues:{
      email:email || "",
      password:"",
    },
    enableReinitialize:true,
    validationSchema,
    onSubmit:async(values)=>{
       try {
    const resultAction = await dispatch(loginAPI(values));

    if (loginAPI.fulfilled.match(resultAction)) {
      toast.success("Login Successful");
    } else {
      toast.error(resultAction.payload || "Login failed");
    }
  } catch (error) {
    console.error("login error: " ,error);
    toast.error("Something went wrong");
  }
    }
  })
  return (
    <div
      data-theme="fantasy" // DaisyUI theme
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b bg-base-200"
    >
      {/* Logo */}
      <h1 className="text-6xl font-extrabold mb-8 text-primary">
        <span className="text-primary">Q</span>uiz
      </h1>

      {/* Card */}
      <div className="card w-96 bg-base-100 shadow-2xl rounded-2xl p-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Login
        </h2>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={formik.handleSubmit}>
          {Boolean(error) && <p>{error}</p>}
          <input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            type="email"
            placeholder="Email Id"
            className="input input-bordered w-full"
          />
          <input
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
          />

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Extra Links */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
