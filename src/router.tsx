import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePassswordPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/account/login" element={<LoginPage />} />
        <Route path="/account/register" element={<RegisterPage />} />
        <Route path="/account/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/account/change-password" element={<ChangePasswordPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}
