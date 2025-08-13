// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 1. 导入 AuthProvider
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        // 2. 用 AuthProvider 包裹 Router
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/exam/:examId" element={<ExamPage />} />
                    <Route path="/results/:submissionId" element={<ResultPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;