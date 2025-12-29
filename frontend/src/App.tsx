import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import LandingPage from "./pages/LandingPage";
import MapPage from "./pages/MapPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Verify2FAPage from "./pages/Verify2FAPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./context/AuthContext"; // Импортируй свой провайдер

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <TopBar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/map" element={
                        <ProtectedRoute>
                            <MapPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/verify" element={<Verify2FAPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;