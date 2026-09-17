import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Booking from "./pages/Booking";
import CourtDetail from "./pages/CourtDetail";
import CourtBooking from "./pages/CourtBooking";
import LogSign from "./pages/LogSign";
import Navbar from "./pages/Navbar";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import Matches from "./pages/Matches";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/:venueId/reserve" element={<CourtBooking />} />
        <Route path="/booking/:venueId" element={<CourtDetail />} />
        <Route path="/logsign" element={<LogSign />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/matches" element={<Matches />} />
      </Routes>
    </div>
  );
}

export default App;

