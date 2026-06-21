import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QML from "./pages/QML";
import PatientDetails from "./pages/PatientDetails";
import PatientsRegistry from "./pages/PatientsRegistry";

// Dynamic route wrapper to check authentication at render time
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("username");
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/patient-details" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
        <Route path="/qml" element={<ProtectedRoute><QML /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><PatientsRegistry /></ProtectedRoute>} />
        <Route path="/cml" element={<Navigate to="/qml" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

