import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AdminRouting from "./modules/Administrator/Admin-routing";
import UserRole from "./modules/UserManagement/UserRole.jsx";
import CreateUserRole from "./modules/UserManagement/Rbac/create-role.jsx";
import UpdateUserRole from "./modules/UserManagement/Rbac/update-role.jsx";
import Sidebar from "./modules/Sidebar/sidebar";
import Navbar from "./modules/Navbar/navbar";
import Department from "./modules/Department/Department.jsx";
import Section from "./modules/Section/Section.jsx";
import Course from "./modules/Course/Course.jsx";
import Subject from "./modules/Subject/Subject.jsx";
import Team from "./modules/Team/Team.jsx";
import Staff from "./modules/Staff/Staff.jsx";

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

                      <Route path="/user-role" element={<UserRole />} />
                      <Route
                        path="/create-user-role"
                        element={<CreateUserRole />}
                      />
                      <Route
                        path="/update-user-role/:id"
                        element={<UpdateUserRole />}
                      />

                      <Route path="/Department" element={<Department />} />
                      <Route path="/Section" element={<Section />} />
                      <Route path="/Course" element={<Course />} />
                      <Route path="/Subject/:courseId" element={<Subject />} />
                      <Route path="/Team" element={<Team />} />
                      <Route path="/Staff" element={<Staff />} />
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
