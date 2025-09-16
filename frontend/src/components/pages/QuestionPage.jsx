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
import { fetchAttemptsAPI, fetchCompleteQuizApi } from "../../store/thunks/resultThunk";
import Footer from "./footer";

const QuestionPage = () => {
  const [userSelectedOption, setUserSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false); //prevents further selection after answering
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

  // Reset selected option and answered status when question changes
  useEffect(() => {
    setUserSelectedOption(null);
    setIsAnswered(false);
  }, [activeQuestionId]);

  // Handle option click
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
    console.log(isFinalQuestion);
    if (isFinalQuestion) {
      // TODO: dispatch submit quiz API
      dispatch(submitQuizAPI());
      setTimeout(()=>{
        dispatch(fetchCompleteQuizApi());
        dispatch(fetchAttemptsAPI());
        navigate("/result");},500);
      
    
    } else {
      dispatch(activeNextQuestion());
    }
  }, [dispatch, isFinalQuestion,navigate]);

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
      className="min-h-screen bg-base-200 flex flex-col items-center"
    >
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md w-full px-6 py-4 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold mb-3 text-primary">
          <span>Q</span>uiz
        </h1>
        <button className="btn btn-primary">
          <LogOut className="w-4 h-4 mr-2" />
          <Link to="/logout">Logout</Link>
        </button>
      </div>

<div className="flex-1 flex flex-col items-center justify-start w-full">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${(activeQuestionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="card w-[700px] bg-base-100 shadow-2xl rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary text-white px-6 py-2 font-bold text-lg">
            {activeQuestionNumber}/{totalQuestions}
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-6 text-center">
          {activeQuestion.question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-6">
          {activeQuestion.options.map((option) => {
            const isThisSelected = userSelectedOption?.id === option.id;

            // const isCorrect =
            //   option.id === activeQuestion.selectedAnswer?.id &&
            //   activeQuestion.answer_status === "right";
            // const isWrong =
            //   isThisSelected && activeQuestion.answer_status === "wrong";

            // Green if this is the correct answer
            const isCorrect =
              activeQuestion.answer_status === "right" && isThisSelected;

            // Red if user selected this option and it is wrong
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
            className={`btn ${
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
      <Footer/>
    </div>
  );
};

export default QuestionPage;
