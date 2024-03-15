import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import User from "./components/User.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import FaceRecognitionComponent from "./components/FaceRecognitionComponent.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <FaceRecognitionComponent></FaceRecognitionComponent>,
      },
      {
        path: "/user",
        element: <User></User>,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized></Unauthorized>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(

    <RouterProvider router={router} />
 
);
