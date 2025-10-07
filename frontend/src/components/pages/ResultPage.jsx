import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, RotateCcw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchCompleteQuizApi,
  fetchAttemptsAPI,
} from "../../store/thunks/resultThunk";
import useResultState from "../../hooks/useResultState";
import { routes } from "../../App";
import Footer from "./footer";

const QuizResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [displayCorrectAnswers, setDisplayCorrectAnswers] = useState(false);

  const {
    inCorrectAnswers,
    correctAnswers,
    attempts,
    noOfCorrectAswers,
    noOfInCorrectAnswers,
    totalQuestions,
    status,
    loading,
    error,
  } = useResultState();

  useEffect(() => {
    if (status && !noOfInCorrectAnswers) {
      setDisplayCorrectAnswers(true);
    }
  }, [noOfInCorrectAnswers, status]);

  // Fetch results + attempts
  useEffect(() => {
    dispatch(fetchCompleteQuizApi());
    dispatch(fetchAttemptsAPI());
  }, [dispatch]);

  const correctRate = useMemo(() => {
    return totalQuestions > 0
      ? ((noOfCorrectAswers / totalQuestions) * 100).toFixed(0)
      : 0;
  }, [noOfCorrectAswers, totalQuestions]);

  const handleReset = useCallback(() => {
    navigate(routes.protectedRoutes.questions);
  }, [navigate]);

  const dispalyQuestions = useMemo(
    () => (displayCorrectAnswers ? correctAnswers : inCorrectAnswers),
    [displayCorrectAnswers, correctAnswers, inCorrectAnswers]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="toast toast-center toast-middle">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }
  

  return (
    <div
      data-theme="fantasy"
      className="min-h-screen bg-base-200 flex flex-col"
    >
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md w-full px-4 sm:px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-primary">
          <span>Q</span>uiz
        </h1>

        <div className="flex gap-2 sm:gap-4">
          <button
            className="btn btn-sm sm:btn-md btn-primary flex items-center gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
          <button className="btn btn-sm sm:btn-md btn-primary flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <Link to="/logout">Logout</Link>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t-4 border-white mb-6"></div>

      <div className="flex-1 flex flex-col items-center justify-start w-full px-3 sm:px-6">
        {/* Score Summary + Answer Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
          {/* Score Summary */}
          <div className="card bg-base-100 shadow-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Score Summary
            </h2>

            {/* Circular Scorebar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-40 sm:w-64 sm:h-64 flex items-center justify-center">
                {/* Radial Progress */}
                <div
                  className="radial-progress text-primary w-40 h-40 sm:w-64 sm:h-64"
                  style={{ "--value": correctRate }}
                  role="progressbar"
                ></div>

                {/* Centered Content */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl sm:text-5xl font-bold text-primary">
                    {noOfCorrectAswers}
                  </span>
                  <span className="mt-1 sm:mt-2 text-sm sm:text-lg text-gray-700 font-medium">
                    Your Score
                  </span>
                </div>
                <style>{`
    .radial-progress::after {
      display: none;
    }
  `}</style>
              </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-sm sm:text-base font-medium">
                  Attempts
                </div>
                <div className="stat-value text-primary text-xl sm:text-2xl">
                  {attempts.attempts}
                </div>
              </div>

              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-sm sm:text-base font-medium">
                  Completions
                </div>
                <div className="stat-value text-primary text-xl sm:text-2xl">
                  100%
                </div>
              </div>

              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-sm sm:text-base font-medium">
                  Total Questions
                </div>
                <div className="stat-value text-primary text-xl sm:text-2xl">
                  {totalQuestions}
                </div>
              </div>

              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-success text-sm sm:text-base font-medium">
                  Correct Answers
                </div>
                <div className="stat-value text-success text-xl sm:text-2xl">
                  {noOfCorrectAswers}
                </div>
              </div>

              <div className="stat bg-base-200 rounded-lg p-3 sm:p-4">
                <div className="stat-title text-error text-sm sm:text-base font-medium">
                  Wrong Answers
                </div>
                <div className="stat-value text-error text-xl sm:text-2xl">
                  {noOfInCorrectAnswers}
                </div>
              </div>
            </div>
          </div>

          {/* Answer Breakdown */}
          <div className="card bg-base-100 shadow-xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Your Answers
            </h2>
            <ul className="space-y-3 sm:space-y-4">
              {dispalyQuestions?.length ? (
                dispalyQuestions.map((item, index) => (
                  <li
                    key={"result-" + item.question_id}
                    className={`p-3 sm:p-4 rounded border ${
                      correctAnswers.includes(item)
                        ? "border-success bg-success/10"
                        : "border-error bg-error/10"
                    }`}
                  >
                    {/* Question */}
                    <p className="font-medium text-sm sm:text-base">
                      {index + 1}. {item.question}
                    </p>

                    {/* User Answer */}
                    <p className="text-sm sm:text-base">
                      Your Answer:{" "}
                      <span
                        className={`font-semibold ${
                          correctAnswers.includes(item)
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        {item.submitted_answer.value}
                      </span>
                    </p>

                    {/* Correct Answer (only if user was wrong) */}
                    {inCorrectAnswers.includes(item) && (
                      <p className="text-sm sm:text-base">
                        Correct Answer:{" "}
                        <span className="font-semibold text-success">
                          {item.answer.value}
                        </span>
                      </p>
                    )}
                  </li>
                ))
              ) : (
                <p>No Answers found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuizResults;

// import React from "react";
// import { LogOut, RotateCcw } from "lucide-react";
// import { Link } from "react-router-dom";

// const QuizResults = ({ onRestart }) => {
//   // const quizData = {
//   //   totalQuizzes: 1,
//   //   correctAnswers: 4,
//   //   totalQuestions: 10,
//   //   wrongAnswers: 6,
//   //   answers: [
//   //     {
//   //       question: "What is the capital of Australia?",
//   //       userAnswer: "Sydney",
//   //       correctAnswer: "Canberra",
//   //       isCorrect: false,
//   //     },
//   //     {
//   //       question: "What is the smallest country in the world?",
//   //       userAnswer: "Vatican City",
//   //       correctAnswer: "Vatican City",
//   //       isCorrect: true,
//   //     },
//   //     {
//   //       question: "What is the capital of New Zealand?",
//   //       userAnswer: "Auckland",
//   //       correctAnswer: "Wellington",
//   //       isCorrect: false,
//   //     },
//   //     {
//   //       question: "What is the capital of France?",
//   //       userAnswer: "Paris",
//   //       correctAnswer: "Paris",
//   //       isCorrect: true,
//   //     },
//   //     {
//   //       question: "What is the capital of Canada?",
//   //       userAnswer: "Toronto",
//   //       correctAnswer: "Ottawa",
//   //       isCorrect: false,
//   //     },
//   //     {
//   //       question: "What is the capital of the United States?",
//   //       userAnswer: "New York",
//   //       correctAnswer: "Washington, D.C.",
//   //       isCorrect: false,
//   //     },
//   //     {
//   //       question: "What is the capital of Mexico?",
//   //       userAnswer: "Mexico City",
//   //       correctAnswer: "Mexico City",
//   //       isCorrect: true,
//   //     },
//   //     {
//   //       question: "What is the capital of Brazil?",
//   //       userAnswer: "Rio de Janeiro",
//   //       correctAnswer: "Brasília",
//   //       isCorrect: false,
//   //     },
//   //     {
//   //       question: "What is the capital of Argentina?",
//   //       userAnswer: "Buenos Aires",
//   //       correctAnswer: "Buenos Aires",
//   //       isCorrect: true,
//   //     },
//   //     {
//   //       question: "What is the capital of Spain?",
//   //       userAnswer: "Barcelona",
//   //       correctAnswer: "Madrid",
//   //       isCorrect: false,
//   //     },
//   //   ],
//   // };

//   // const {
//   //   totalQuizzes,
//   //   correctAnswers,
//   //   totalQuestions,
//   //   wrongAnswers,
//   //   answers,
//   // } = quizData;
//   // const correctRate = ((correctAnswers / totalQuestions) * 100).toFixed(0);

//   const{
//     inCorrectAnswers,
//     correctAnswer,
//     attempts,
//     noOfCorrectAnswers,
//     noOfInCorrectAnswers,
//     totalQuestions,
//     status,
//     loading,
//     error,
//   } = useResultState();
//   return (
//     <div
//       data-theme="fantasy"
//       className="min-h-screen bg-base-200 flex flex-col items-center"
//     >
//       {/* Navbar */}
//       <div className="navbar bg-base-100 shadow-md w-full px-6 py-4 flex justify-between items-center">
//         {/* Logo */}
//         <h1 className="text-4xl font-extrabold mb-3 text-primary">
//           <span>Q</span>uiz
//         </h1>

//         {/* Buttons */}
//         <div className="flex gap-4">
//           <button className="btn btn-primary" onClick={onRestart}>
//             <RotateCcw className="w-4 h-4 mr-2" />
//             Restart
//           </button>
//           <button className="btn btn-primary">
//             <LogOut className="w-4 h-4 mr-2" />
//             <Link to="/logout">Logout</Link>
//           </button>
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="w-full border-t-4 border-white mb-8"></div>

//       {/* Score Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 w-full max-w-6xl">
//         <div className="card bg-base-100 shadow-xl p-6">
//           <h2 className="text-xl font-semibold mb-4">Score Summary</h2>

//           {/* Circular Scorebar */}
//           <div className="flex flex-col items-center mb-6">
//             <div
//               className="radial-progress text-primary w-64 h-64 text-5xl font-bold relative"
//               style={{ "--value": correctRate }}
//               role="progressbar"
//             >
//               {correctAnswers}
//               <p className="mt-4 text-lg text-gray-700 font-medium">
//                 Your Score
//               </p>
//               <style>{`.radial-progress::after { display: none; }`}</style>
//             </div>
//           </div>

//           {/* Stat Grid */}
//           <div className="grid grid-cols-2 gap-4 text-center">
//             <div className="stat bg-base-200 rounded-lg p-4">
//               <div className="stat-title font-medium">Quizzes Played</div>
//               <div className="stat-value text-primary text-2xl">
//                 {totalQuizzes}
//               </div>
//             </div>

//             <div className="stat bg-base-200 rounded-lg p-4">
//               <div className="stat-title font-medium">Completions</div>
//               <div className="stat-value text-primary text-2xl">100%</div>
//             </div>

//             <div className="stat bg-base-200 rounded-lg p-4">
//               <div className="stat-title font-medium">Total Questions</div>
//               <div className="stat-value text-primary text-2xl">
//                 {totalQuestions}
//               </div>
//             </div>

//             <div className="stat bg-base-200 rounded-lg p-4">
//               <div className="stat-title text-success font-medium">
//                 Correct Answers
//               </div>
//               <div className="stat-value text-success text-2xl">4</div>
//             </div>

//             <div className="stat bg-base-200 rounded-lg p-4">
//               <div className="stat-title text-error font-medium">
//                 Wrong Answers
//               </div>
//               <div className="stat-value text-error text-2xl">
//                 {wrongAnswers}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Answer Breakdown */}
//         <div className="card bg-base-100 shadow-xl p-6">
//           <h2 className="text-xl font-semibold mb-4">Your Answers</h2>
//           <ul className="space-y-4">
//             {answers.map((item, index) => (
//               <li
//                 key={index}
//                 className={`p-4 rounded border ${
//                   item.isCorrect
//                     ? "border-success bg-success/10"
//                     : "border-error bg-error/10"
//                 }`}
//               >
//                 <p className="font-medium">
//                   {index + 1}. {item.question}
//                 </p>
//                 <p>
//                   User Answer:{" "}
//                   <span
//                     className={`font-semibold ${
//                       item.isCorrect ? "text-success" : "text-error"
//                     }`}
//                   >
//                     {item.userAnswer}
//                   </span>
//                 </p>
//                 {!item.isCorrect && (
//                   <p>
//                     Correct Answer:{" "}
//                     <span className="font-semibold text-success">
//                       {item.correctAnswer}
//                     </span>
//                   </p>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizResults;
