import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TrackBus from "./pages/TrackBus";
import RoutesPage from "./pages/Routes";
import About from "./pages/About";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/track" element={<TrackBus />} />

        <Route path="/routes" element={<RoutesPage />} />

        <Route path="/about" element={<About />} />

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;