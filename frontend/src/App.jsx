import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import AIResult from "./pages/AIResult";
import TrackComplaint from "./pages/TrackComplaint";
import Confirmation from "./pages/Confirmation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/result" element={<AIResult />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/confirm/:id" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;