import "./index.css";
import "./App.css";
import { BrowserRouter, Routes, Route,  Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Signup from "./components/pages/Signup";
import Login from "./components/pages/Login"; // ✅ create this component
import WelcomePage from "./components/pages/WelcomePage";
import {Toaster} from "react-hot-toast"
import ProtectedRoutes from "./components/ProtectedRoutes";
import QuestionPage from "./components/pages/QuestionPage";
import Logout from "./components/pages/Logout";
import ResultPage from "./components/pages/ResultPage";

export const routes = {
  signup:"/signup",
  login:"/login",
  protectedRoutes:{
    welcome:"/welcome",
    questions:"/questions",
    result:"/result",
    logout:"/logout",
  }
}
const router = createBrowserRouter([
  { path: "/", element: <Navigate to={routes.login} replace /> },
  {
    path: routes.signup,
    element: <Signup />,
  },
  {
    path: routes.login,
    element: <Login />,
  },
  {
    path: routes.protectedRoutes.welcome,
    element: <ProtectedRoutes element={<WelcomePage />} />,
  },
  {
    path: routes.protectedRoutes.questions,
    element: <ProtectedRoutes element={<QuestionPage />} />,
  },
  {
    path: routes.protectedRoutes.logout,
    element: <ProtectedRoutes element={<Logout />} />,
  },
  {
    path:routes.protectedRoutes.result,
    element:<ProtectedRoutes element={<ResultPage/>}/>
  }
]);

function App() {
  return (
   
      <div className="min-h-screen bg-base-200 text-base-content">
        <Toaster />
        <RouterProvider router={router}/>
       
      </div>
 
  );
}

export default App;
