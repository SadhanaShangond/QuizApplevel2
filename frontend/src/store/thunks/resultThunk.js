import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";
import { COMPLETED_QUIZ_ENDPOINT, QUIZ_ATTEMPTS_ENDPOINTS } from "../../utils/endpoints";

export const fetchCompleteQuizApi = createAsyncThunk("result/fetchQuiz",async(_,thunkAPI)=>{
    try {
        const response = await apiRequest({endpoint:COMPLETED_QUIZ_ENDPOINT});
        const jsonData = await response.json();
        if(response.ok){
            return jsonData;
        }else{
            return thunkAPI.rejectWithValue(jsonData.message);
        }
    } catch (error) {
         let sendError = "couldnot fetch results,something went wrong";
         if ("message" in error) {
           sendError = error.message;
         }
         return thunkAPI.rejectWithValue(sendError);
    }
})

export const fetchAttemptsAPI = createAsyncThunk("result/fetchAttempts",async(_,thunkAPI)=>{
    try {
        const response = await apiRequest({endpoint:QUIZ_ATTEMPTS_ENDPOINTS});
        const jsonData = await response.json();
        if(response.ok){
            console.log("API response: ",jsonData );
            return jsonData;
        }else{
            return thunkAPI.rejectWithValue(jsonData.message);
        }
    } catch (error) {
         let sendError = "couldnot fetch Attempts count,something went wrong";
         if ("message" in error) {
           sendError = error.message;
         }
         return thunkAPI.rejectWithValue(sendError);
    }
})
