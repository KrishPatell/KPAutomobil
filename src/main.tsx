import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import BookFlow from "./routes/book/BookFlow";
import "./index.css";

// Two routes: the marketing page, and the quote flow it exists to feed. Anything else goes home
// rather than rendering a blank page.
//
// /book/:step is a real path, not a hash, so each step is shareable and the browser's own Back
// button works. That needs an SPA fallback on whatever serves dist/ — Vite's dev server does it
// out of the box; a static host needs "rewrite everything to /index.html".
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />} path="/" />
        <Route element={<BookFlow />} path="/book" />
        <Route element={<BookFlow />} path="/book/:step" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
