import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import TopBar from "./components/TopBar";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Verify2FAPage from "./pages/Verify2FAPage";
import ProfilePage from "./pages/ProfilePage";

const LandingPage = () => <div style={{margin: "30px"}}><h1>ParaHub</h1><p>Карта для парапланеристов России</p></div>;

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <TopBar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify" element={<Verify2FAPage />} />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;