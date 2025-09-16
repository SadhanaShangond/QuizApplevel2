import { createSlice } from "@reduxjs/toolkit";
import { fetchAttemptsAPI, fetchCompleteQuizApi } from "../thunks/resultThunk";

const initialState = {
    status:false,
    inCorrectAnswers:[],
    correctAnswers:[],
    attempts:0,
    loading:true,
    error:null,
}

const resultSlice = createSlice({
    name:"result",
    initialState,
    extraReducers(builder){

        builder.addCase(fetchCompleteQuizApi.pending,(state)=>{
            state.loading = true;
            state.error=null;
            state.status=false;
        })
        builder.addCase(fetchCompleteQuizApi.fulfilled,(state,action)=>{
            state.loading = false;
            state.status=action.payload.status;
            state.correctAnswers= action.payload.correct_questions;
            state.inCorrectAnswers=action.payload.incorrect_questions;
        })
        builder.addCase(fetchCompleteQuizApi.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })


        builder.addCase(fetchAttemptsAPI.fulfilled,(state,action)=>{
            state.loading=false;
            state.attempts=action.payload;
        })
          builder.addCase(fetchAttemptsAPI.pending, (state) => {
            state.loading = true;        
          });
            builder.addCase(fetchAttemptsAPI.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            });
            
    }
})
export default resultSlice.reducer;