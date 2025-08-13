// frontend/src/pages/RegisterPage.jsx
import React, { useState } from 'react'; // <-- 修正这里的拼写错误
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api.js';
import './AuthForm.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ // <-- 修正这里的拼写错误
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null); // <-- 修正这里的拼写错误
    const [loading, setLoading] = useState(false); // <-- 修正这里的拼写错误

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await registerUser(formData);
            alert('注册成功！现在将跳转到登录页面。');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || '注册失败，请稍后再试。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>创建账户</h2>
                <div className="form-group">
                    <label htmlFor="name">姓名</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">邮箱地址</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">密码</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? '注册中...' : '注册'}
                </button>
                <p className="switch-form-text">
                    已经有账户了？ <Link to="/login">点此登录</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;