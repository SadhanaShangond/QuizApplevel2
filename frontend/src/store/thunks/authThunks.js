// thunkAPI: an object containing all of the parameters that are normally passed to a Redux thunk function, as well as additional options:
// dispatch: the Redux store dispatch method
// getState: the Redux store getState method
// extra: the "extra argument" given to the thunk middleware on setup, if available
// requestId: a unique string ID value that was automatically generated to identify this request sequence
// signal: an AbortController.signal object that may be used to see if another part of the app logic has marked this request as needing cancelation.
// rejectWithValue(value, [meta]): rejectWithValue is a utility function that you can return (or throw) in your action creator to return a rejected response with a defined payload and meta. It will pass whatever value you give it and return it in the payload of the rejected action. If you also pass in a meta, it will be merged with the existing rejectedAction.meta.

// fulfillWithValue(value, meta): fulfillWithValue is a utility function that you can return in your action creator to fulfill with a value while having the ability of adding to fulfilledAction.meta.
// The logic in the payloadCreator function may use any of these values as needed to calculate the result.

import { createAsyncThunk } from "@reduxjs/toolkit";
import { LOGIN_ENDPOINT, SIGNUP_ENDPOINT } from "../../utils/endpoints";
import apiRequest from "../../utils/apiRequest";


export const signupAPI = createAsyncThunk(
  "auth/signup",
  async (values, thunkAPI) => {
    try {
      const response = await apiRequest({
        endpoint: SIGNUP_ENDPOINT,
        method: "POST",
        includeAuth: false,
        body: {
          username: values.username,
          email: values.email,
          password: values.password,
        },
      });

      const resJson = await response.json();
      if (response.ok) {
        return resJson;
      } else {
        return thunkAPI.rejectWithValue(resJson.message);
      }
    } catch (error) {
      let sendError = "Could not register user, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
);


export const loginAPI = createAsyncThunk("auth/login",
  async(values,thunkAPI)=>{
    try{
      const response=await apiRequest({
        endpoint:LOGIN_ENDPOINT,
        method:"POST",
        includeAuth:false,
        body:values,
      })
      const resJson = await response.json();
      if(response.ok){

        const {accessToken} = resJson;
        localStorage.setItem("accessToken",accessToken);
        localStorage.setItem("email",values.email);

        return values.email;
      }else{
        return thunkAPI.rejectWithValue(resJson.message);
      }
    }catch(error){
      let sendError = "Could not logi, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
)

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (isTokenExpired = false, thunkAPI) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
    return isTokenExpired;
  }
);