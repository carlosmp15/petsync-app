import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ChangePasswordPage from "./pages/ChangePassswordPage"
import SidebarLayout from "./layouts/SidebarLayout"
import SettingsPage from "./pages/SettingsPage"
import ManageFeedingsPage from "./pages/ManageFeedingsPage"
import ManageDailyActivities from "./pages/ManageDailyActivitiesPage"
import ManageMedicalHistoriesPage from "./pages/ManageMedicalHistoriesPage"
import LandingPage from "./pages/LandingPage"


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/account/login" element={<LoginPage />} />
        <Route path="/account/register" element={<RegisterPage />} />
        <Route
          path="/account/forgot-password"
          element={<ForgotPasswordPage />}
        />
        <Route
          path="/account/change-password"
          element={<ChangePasswordPage />}
        />

        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/account/settings" element={<SettingsPage />} />
          <Route path="/pet/feedings" element={<ManageFeedingsPage />} />
          <Route path="/pet/daily-activities" element={<ManageDailyActivities />} />
          <Route path="/pet/medical-histories" element={<ManageMedicalHistoriesPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}
