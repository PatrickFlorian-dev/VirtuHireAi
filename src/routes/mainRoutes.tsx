import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "../hooks/useAuth"; // 👈 Your auth hook

import Home from "../pages/main/Home";
import Profile from "../pages/main/Profile";
import Login from "../pages/main/Login";
import Demo from "../pages/main/Demo";
import Register from "../pages/main/Register";
import NotFound from "../pages/main/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";

import AdminLayout from "../components/admin/adminLayout";
import CandidateManagement from "../pages/admin/CandidateManagement";
import CompanyManagement from "../pages/admin/CompanyManagement";
import EmployeeManagement from "../pages/admin/EmployeeManagement";
import InterviewManagement from "../pages/admin/InterviewManagement";
import JobManagement from "../pages/admin/JobManagement";

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));

function MainRoutes() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const hideNavbarRoutes = ["/notfound", "/candidate"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Admin section */}
      {isAdminRoute ? (
        !user ? (
          <Navigate to="/login" replace />
        ) : (
          <AdminLayout>
            <Routes>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/candidate" element={<CandidateManagement />} />
              <Route path="/admin/company" element={<CompanyManagement />} />
              <Route path="/admin/employee" element={<EmployeeManagement />} />
              <Route path="/admin/interview" element={<InterviewManagement />} />
              <Route path="/admin/job" element={<JobManagement />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        )
      ) : (
        // Public section
        <>
          {showNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/demo" element={<Demo />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}
    </Suspense>
  );
}

export default MainRoutes;
