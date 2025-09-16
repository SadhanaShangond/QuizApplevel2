import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";
import { FETCH_QUESTIONS_ENDPOINT, SUBMIT_QUIZ_ENDPOINT, VALIDATE_ANSWERS_ENDPOINT } from "../../utils/endpoints";

export const fetchQuestionsAPI = createAsyncThunk(
    "questions/fetch",
    async(_,thunkAPI)=>{
        try{
            const response = await apiRequest({
                endpoint:FETCH_QUESTIONS_ENDPOINT
            })
            const resJson = await response.json()
            if(response.ok){
                return resJson;
            }else{
                return thunkAPI.rejectWithValue(resJson.message);
            }
        }catch(error){
            let sendError="couldnot fetch questions ,something went wrong";
            if("message" in error){
                sendError= error.message;

            }
            return thunkAPI.rejectWithValue(sendError);
        }
    }
)

export const validateAnswerAPI = createAsyncThunk("questions/validateAnswer",async(value,thunkAPI)=>{
    try{
        const response = await apiRequest({
            endpoint:VALIDATE_ANSWERS_ENDPOINT,
            method:"POST",
            body:value,
        })
        const resJson = await response.json();
        if(response.ok){
            return resJson;
        }else{
            return thunkAPI.rejectWithValue(resJson.message);
        }
    }catch(error){
          let sendError = "couldnot valiadte answer ,something went wrong";
          if ("message" in error) {
            sendError = error.message;
          }
          return thunkAPI.rejectWithValue(sendError);
    }
});


export const submitQuizAPI = createAsyncThunk("questions/submitQuiz",
    async(thunkAPI)=>{
       try {
         const response = await apiRequest({
           endpoint: SUBMIT_QUIZ_ENDPOINT,
           method: "POST",
         });
         const resJson = await response.json();
         if(response.ok){
            return resJson;
         }else{
            return thunkAPI.rejectWithValue(resJson.message);
         }
        
       } catch (error) {
         let sendError = "couldnot submit Quiz ,something went wrong";
         if ("message" in error) {
           sendError = error.message;
         }
         return thunkAPI.rejectWithValue(sendError);
       }
    }
)