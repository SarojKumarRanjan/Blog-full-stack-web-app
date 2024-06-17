import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "./utils/ThemeContext.jsx";
import {
  Loginpage,
  Home,
  Contact,
  Signuppage,
  SingleBlog,
  About,
  Blogs,
} from "./pages/index.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={<Signuppage />} />
      <Route path="/blog/:id" element={<SingleBlog />} />
      <Route path="/about" element={<About />} />
      <Route path="/blogs" element={<Blogs />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
    <Toaster />
    <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);