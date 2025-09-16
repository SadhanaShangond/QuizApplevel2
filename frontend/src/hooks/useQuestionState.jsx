import { useMemo } from "react";
import { useSelector } from "react-redux";

const useQuestionState = () => {
  const questionState = useSelector((state) => state.questions);

  const {
    questions,
    activeQuestionId,
    loading,
    isValidatingAnswer,
    isSubmittingQuiz,
    error,
  } = questionState;

  const activeQuestion = useMemo(
    () => questions.find((q) => q._id === activeQuestionId),
    [activeQuestionId, questions]
  );

  const activeQuestionNumber = useMemo(
    () => questions.findIndex((q) => q._id === activeQuestionId) + 1,
    [activeQuestionId, questions]
  );

  const totalQuestions = useMemo(() => questions.length, [questions]);

  return {
    activeQuestion,
    activeQuestionNumber,
    totalQuestions,
    activeQuestionId,
    loading,
    isValidatingAnswer,
    isSubmittingQuiz,
    error,
  };
};

export default useQuestionState;
