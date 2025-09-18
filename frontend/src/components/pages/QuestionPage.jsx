import React, { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useQuestionState from "../../hooks/useQuestionState";
import {
  fetchQuestionsAPI,
  submitQuizAPI,
  validateAnswerAPI,
} from "../../store/thunks/questionsThunks";
import Option from "../../components/pages/Option";
import { activeNextQuestion } from "../../store/Slices/QuestionSlice";
import {
  fetchAttemptsAPI,
  fetchCompleteQuizApi,
} from "../../store/thunks/resultThunk";
import Footer from "./footer";

const QuestionPage = () => {
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    activeQuestion,
    activeQuestionNumber,
    totalQuestions,
    activeQuestionId,
    loading,
    isValidatingAnswer,
    isSubmittingQuiz,
    error,
  } = useQuestionState();

  // Fetch questions once
  useEffect(() => {
    dispatch(fetchQuestionsAPI());
  }, [dispatch]);

  // Reset option when question changes
  useEffect(() => {
    setUserSelectedOption(null);
    setIsAnswered(false);
  }, [activeQuestionId]);

  const handleOptionClick = useCallback(
    async (selectedOption) => {
      if (isAnswered || isValidatingAnswer) return;
      setUserSelectedOption(selectedOption);

      try {
        await dispatch(
          validateAnswerAPI({
            questionId: activeQuestionId,
            answer: selectedOption,
          })
        ).unwrap();
      } catch (error) {
        console.error("error validating answer", error);
      } finally {
        setIsAnswered(true);
      }
    },
    [activeQuestionId, dispatch, isAnswered, isValidatingAnswer]
  );

  const isFinalQuestion = activeQuestionNumber === totalQuestions;

  const moveForward = useCallback(() => {
    if (isFinalQuestion) {
      dispatch(submitQuizAPI());
      setTimeout(() => {
        dispatch(fetchCompleteQuizApi());
        dispatch(fetchAttemptsAPI());
        navigate("/result");
      }, 500);
    } else {
      dispatch(activeNextQuestion());
    }
  }, [dispatch, isFinalQuestion, navigate]);

  if (loading || !activeQuestionId) {
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
          <span>Q</span>uiz
        </h1>
        <button className="btn btn-sm sm:btn-md btn-primary flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          <Link to="/logout">Logout</Link>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start w-full px-3 sm:px-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 sm:mb-6">
          <div
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${(activeQuestionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>

        {/* Question Card */}
        <div className="card w-full max-w-lg sm:max-w-2xl bg-base-100 shadow-2xl rounded-2xl p-4 sm:p-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="rounded-full bg-primary text-white px-4 py-1 sm:px-6 sm:py-2 font-bold text-sm sm:text-lg">
              {activeQuestionNumber}/{totalQuestions}
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center">
            {activeQuestion.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            {activeQuestion.options.map((option) => {
              const isThisSelected = userSelectedOption?.id === option.id;

              const isCorrect =
                activeQuestion.answer_status === "right" && isThisSelected;

              const isWrong =
                isThisSelected && activeQuestion.answer_status === "wrong";

              return (
                <Option
                  key={option.id}
                  option={option}
                  isSelected={isThisSelected}
                  isCorrect={isCorrect}
                  isWrong={isWrong}
                  isAnswered={isAnswered}
                  isValidating={isValidatingAnswer && isThisSelected}
                  onClick={handleOptionClick}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <div className="flex justify-center">
            <button
              className={`btn w-full sm:w-auto ${
                isFinalQuestion ? "btn-success" : "btn-primary"
              } ${isSubmittingQuiz ? "loading" : ""}`}
              onClick={moveForward}
              disabled={!isAnswered || isSubmittingQuiz}
            >
              {isSubmittingQuiz
                ? "Submitting..."
                : isFinalQuestion
                ? "Submit Quiz"
                : "Next ➜"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuestionPage;
