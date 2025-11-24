import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ThemeProviders from "./components/ThemeProviders";
import Home from "./pages/Home";
import AboutPage from "./pages/About";
import Layout from "./components/Layout"; // Import Layout

function App() {
  return (
    <div dir="rtl">
      <ThemeProviders>
        <Router>
          <Routes>
            {/* Wrap everything in Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProviders>
    </div>
  );
}

export default App;
