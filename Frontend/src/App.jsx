import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRouter from "./routes/AppRouter";
import "./App.css";

const App = () => {
  return (
    <div className="app-container" style={{ flexGrow: 1 }}>
      <Header />
      {/* Main content area stretches to fill remaining space */}
      <main className="main-content">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
};

export default App;
