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

import AdminDashboard from "./pages/AdminDashboard";
import AdminApprovals from "./pages/AdminApprovals";
import AdminUsers from "./pages/AdminUsers";
import AdminProfile from "./pages/AdminProfile";

import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerFacilities from "./pages/OwnerFacilities";
import OwnerCourts from "./pages/OwnerCourts";
import OwnerBookings from "./pages/OwnerBookings";
import OwnerProfile from "./pages/OwnerProfile";

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
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/approvals" element={<AdminApprovals />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* Owner Routes */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/facilities" element={<OwnerFacilities />} />
        <Route path="/owner/courts" element={<OwnerCourts />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
      </Routes>
    </div>
  );
}

export default App;
