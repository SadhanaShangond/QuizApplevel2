import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import questionReducer from "./Slices/QuestionSlice"
import resultReducer from "./Slices/ResultSlice"

const store = configureStore({
    reducer:{
        auth:authReducer,
        questions:questionReducer,
        result:resultReducer,
    },
})

export default store;