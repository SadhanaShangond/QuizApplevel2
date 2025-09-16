import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import { signupAPI } from "../../store/thunks/authThunks";
import toast from "react-hot-toast";
import useAuthState from "../../hooks/useAuthSlice";
import { routes } from "../../App";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isAuthenticated,email} = useAuthState();

  useEffect(()=>{
    if(email){
      navigate(routes.login);

    }else if(isAuthenticated){
      navigate(routes.protectedRoutes.welcome)
    }
  })

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      username: Yup.string().trim().required("User name is Required"),
      email: Yup.string()
        .trim()
        .email("Invalid email Id")
        .required("Email is required"),
      password: Yup.string().trim().required("Password is required"),
      confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref("password"), null], "Password must match")
        .required("Confirm Password is required"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema, // ✅ correct prop name
    onSubmit: async(values) => {
       const resultAction = await dispatch(signupAPI(values));

       if (signupAPI.fulfilled.match(resultAction)) {
         toast.success("Signup Successful");
       } else {
         toast.error(resultAction.payload || "Signup failed");
       }
    },
  });

  return (
    <div
      data-theme="fantasy"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b bg-base-200"
    >
      {/* Logo */}
      <h1 className="text-6xl font-extrabold mb-8 text-primary">
        <span className="text-primary">Q</span>uiz
      </h1>

      {/* Card */}
      <div className="card w-96 bg-base-100 shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Sign Up
        </h2>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <input
              name="username"
              value={formik.values.username} // ✅ fixed
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="User Name"
              className="input input-bordered w-full"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm">{formik.errors.username}</p>
            )}
          </div>
          <div>
            <input
              name="email"
              value={formik.values.email} // ✅ fixed
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              placeholder="Email Id"
              className="input input-bordered w-full"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <input
              name="password"
              value={formik.values.password} // ✅ fixed
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>
          <div>
            <input
              name="confirmPassword"
              value={formik.values.confirmPassword} // ✅ fixed
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Submit
          </button>
        </form>

        {/* ✅ Login redirect */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
