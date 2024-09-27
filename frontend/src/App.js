import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AdminRouting from "./modules/Administrator/Admin-routing";
import Sidebar from "./modules/Sidebar/sidebar";
import Navbar from "./modules/Navbar/navbar";
import Department from "./modules/Department/Department.jsx";

function AppContent() {
  const location = useLocation();
  const hideSidebarAndPadding = [
    "/",
    "/forgot-password",
    "/OTP",
    "/change-password",
  ].includes(location.pathname);

  return (
    <div className="app-container d-flex">
      {!hideSidebarAndPadding && <Sidebar />}
      <div className="flex-grow-1 d-flex flex-column">
        {!hideSidebarAndPadding && <Navbar />}
        <div
          className={`flex-grow-1 ${
            !hideSidebarAndPadding ? "p-4 default-bg" : ""
          }`}
        >
          <div className="app-container d-flex">
            <div className="flex-grow-1 d-flex flex-column">
              <div className="flex-grow-1 p-4 default-bg">
                <div className="app">
                  <div className="container">
                    <Routes>
                      <Route
                        path="/admin/masterList"
                        element={<AdminRouting />}
                      />
                      <Route path="/Department" element={<Department />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
