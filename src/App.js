import React from "react";
import './components/Navbar.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import BillForm from "./components/Invoice";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import OrderHistory from "./components/OrderHistory";
import HoldBills from "./components/HoldBills";
import Report from "./components/Report";
import Footer from "./components/Footer";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideNavbar && (
        <div className="nav-container">
          <nav className="navbar">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/invoice">Invoice</Link>
            <Link to="/history">Order History</Link>
            <Link to="/hold-bills">Bills On Hold</Link>
            <Link to="/report">Report</Link>
            <Link to="/auth">Logout</Link>
          </nav>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/invoice" element={<BillForm />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/hold-bills" element={<HoldBills />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

// This allows Dashboard to navigate using hooks
function DashboardWrapper() {
  const navigate = useNavigate();
  return <Dashboard onNavigate={(route) => {
    if (route === 'invoice') navigate('/invoice');
    else if (route === 'orderHistory') navigate('/history');
    else if (route === 'holdBills') navigate('/hold-bills');
    else if (route === 'report') navigate('/report');
  }} />;
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
