import React from "react";
import './components/Navbar.css';
import {BrowserRouter as Router,Routes,Route,Navigate,Link,useLocation} from "react-router-dom";
import BillForm from "./components/Invoice";
import AuthPage from "./components/AuthPage";
import OrderHistory from "./components/OrderHistory";
import HeldBills from "./components/HeldBills";
import ZReport from "./components/ZReport";
import { Links } from "react-router-dom";
import Footer from "./components/Footer"; // Footer import

// Layout component with conditional navbar
function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideNavbar && (
        <div className="nav-container">
          <nav className="navbar">
            <Link to="/invoice">Invoice</Link>
            <Link to="/history">Order History</Link>
            <Link to="/held-bills">Bills On Hold</Link>
            <Link to="/z-report" style={{ margin: '10px', fontWeight: 'bold' }}>Z Report</Link>
            <Link to="/auth">Logout</Link>
          </nav>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/invoice" element={<BillForm />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/held-bills" element={<HeldBills />} />
          <Route path="/z-report" element={<ZReport />} />
        </Routes>
      </div>

      {/* Always show Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
