import { useMemo } from "react";
import { useSelector } from "react-redux";

function useResultState(){

  const {status,inCorrectAnswers,correctAnswers,attempts,loading,error}=useSelector((state)=>state.result);

  const [noOfCorrectAswers,noOfInCorrectAnswers]= useMemo(()=>{
    const correct = correctAnswers?.length ?? 0;
    const incorrect = inCorrectAnswers?.length ??0;

    return [correct,incorrect];
  },[correctAnswers?.length,inCorrectAnswers?.length])

  const totalQuestions = useMemo(()=> noOfCorrectAswers+noOfInCorrectAnswers,[noOfCorrectAswers,noOfInCorrectAnswers])


  const values = useMemo(
    () => ({
      inCorrectAnswers,
      correctAnswers,
      attempts,
      noOfCorrectAswers,
      noOfInCorrectAnswers,
      totalQuestions,
      status,
      loading,
      error,
    }),
    [
      inCorrectAnswers,
      correctAnswers,
      attempts,
      noOfCorrectAswers,
      noOfInCorrectAnswers,
      totalQuestions,
      status,
      loading,
      error,
    ]
  );
return values;
}
export default useResultState;