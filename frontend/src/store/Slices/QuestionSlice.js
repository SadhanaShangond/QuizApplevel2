import { createSlice } from "@reduxjs/toolkit";
import { fetchQuestionsAPI, submitQuizAPI, validateAnswerAPI } from "../thunks/questionsThunks";

const initialState ={
    questions:[], //list of all the quiz questions
    activeQuestionId:"", //the current shown question
    loading:true,//flag for loading question
    isValidatingAnswer:false,//flag during answer validation
    isSubmittingQuiz:false,//flag during quiz submission
    error:null,//to capture any error
}

const questionSlice = createSlice({
    name:"questions",
    initialState,
    reducers:{activeNextQuestion(state){
      const currentIndex = state.questions.findIndex((question)=>question._id === state.activeQuestionId);

      if(currentIndex !== -1 && currentIndex +1 < state.questions.length){
        state.activeQuestionId = state.questions[currentIndex + 1]._id;
      }
    }},
    extraReducers(builder){
        builder.addCase(fetchQuestionsAPI.pending,(state)=>{
            state.questions = [];
            state.activeQuestionId="";
            state.loading=true;
            state.isValidatingAnswer=false;
            state.error=null;

        })

       builder.addCase(fetchQuestionsAPI.fulfilled, (state, action) => {
         state.questions = action.payload.questions;

         // Find the first unattempted question
         const firstUnattempted = action.payload.questions.find(
           (question) => !question.attempted
         );

         // If none unattempted, fallback to first question
         state.activeQuestionId =
           firstUnattempted?._id || action.payload.questions[0]?._id || "";

         state.loading = false;
       });


        builder.addCase(fetchQuestionsAPI.rejected,(state,action)=>{
            state.error = action.payload ;
            state.loading = false;
           
        })

        builder.addCase(validateAnswerAPI.pending,(state)=>{
          state.isValidatingAnswer = true;
          state.error = null;
        })

        builder.addCase(validateAnswerAPI.fulfilled,(state,action)=>{
          state.isValidatingAnswer = false;

          const isCorrect = action.payload.status === 1;

          const activeQuestionId = state.activeQuestionId;

          const activeQuestionIndex = state.questions.findIndex((question)=> question._id === activeQuestionId);

          state.questions[activeQuestionIndex].attempted=true;

          state.questions[activeQuestionIndex].answer_status = isCorrect ? "right" :"wrong";

            // state.questions[activeQuestionIndex].correctAnswerId =
            //   action.payload.correctAnswerId;
        })

        builder.addCase(validateAnswerAPI.rejected,(state,action)=>{
          state.isValidatingAnswer = false;state.error= action.payload;
        })

        
        builder.addCase(submitQuizAPI.pending,(state)=>{
          state.error = null;
          state.isSubmittingQuiz=true;

        })
        // builder.addCase(submitQuizAPI.pending,(state)=>{
        //   state.error=null;
        //   state.isSubmittingQuiz=true;
        // })

        builder.addCase(submitQuizAPI.fulfilled,(state,action)=>{
          state.isSubmittingQuiz = false;
          if(action.payload.status){
            state.questions = [];
            state.activeQuestionId="";
          }else{
            state.error ="couldnot submit quiz";
          }
        })

        builder.addCase(submitQuizAPI.rejected,(state,action)=>{
          state.error = action.payload;
          state.isSubmittingQuiz=false;
        })

    }    
})

export default questionSlice.reducer;
export const{activeNextQuestion}=questionSlice.actions;