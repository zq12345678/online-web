// frontend/src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// --- Exam Services ---
export const fetchAllExams = () => {
    return apiClient.get('/exams');
};

export const fetchExamById = (examId) => {
    return apiClient.get(`/exams/${examId}`);
};

export const submitExamAnswers = (examId, answers) => {
    return apiClient.post('/submissions', { examId, answers });
};


// --- Auth Services (新增) ---
export const registerUser = (userData) => {
    // userData will be an object like { name, email, password }
    return apiClient.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
    // credentials will be an object like { email, password }
    return apiClient.post('/auth/login', credentials);
};