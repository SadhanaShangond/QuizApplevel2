import React from "react";
import { LogOut, CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "./footer";

const WelcomePage = () => {
  return (
    <div
      data-theme="fantasy"
      className="min-h-screen bg-base-200 flex flex-col items-center"
    >
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md w-full px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-4xl font-extrabold mb-3 text-primary">
          <span>Q</span>uiz
        </h1>

        {/* Logout Button */}
        <button className="btn btn-primary">
          <LogOut className="w-4 h-4 mr-2" />
          <Link to="/logout">Logout</Link>
        </button>
      </div>

      {/* Divider */}
      <div className="w-full border-t-4 border-white"></div>

      <div className="flex-1 flex items-center justify-center">
        {/* Main Card */}
        <div className="card bg-base-100 shadow-2xl rounded-box w-full max-w-md p-8 mt-16">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <HelpCircle size={80} className="text-info mb-4" />

            {/* Title */}
            <p className="text-2xl font-bold text-base-content mb-2">
              Are you ready?
            </p>

            {/* Subtitle */}
            <p className="text-base text-base-content mb-6 opacity-80">
              Let's see how many questions you can answer:
            </p>

            {/* Checklist */}
            <ul className="space-y-2 text-left mb-6">
              <li className="flex items-center text-base-content">
                <CheckCircle2 className="text-success mr-2" />
                There are 10 questions
              </li>
              <li className="flex items-center text-base-content">
                <CheckCircle2 className="text-success mr-2" />
                You need to pick 1 answer
              </li>
            </ul>

            {/* Start Quiz Button */}
            <button className="btn btn-primary w-full text-lg font-semibold">
              <Link to={"/questions"}>Start the Quiz</Link>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WelcomePage;
