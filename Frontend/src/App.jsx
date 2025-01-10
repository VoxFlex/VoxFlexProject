import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRouter from "./routes/AppRouter";
import "./App.css";
import AppAppBar from "./components/AppBar";

const App = () => {
  return (
    <div className="app-container">
      <Header />
      {/* <AppAppBar /> */}
      {/* Main content area stretches to fill remaining space */}
      <main>
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
};

export default App;
