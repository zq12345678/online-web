// frontend/src/pages/LoginPage.jsx
import React, { useState, useContext } from 'react'; // 1. 导入 useContext
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api.js';
import { AuthContext } from '../context/AuthContext'; // 2. 导入我们的 AuthContext
import './AuthForm.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // 3. 从 Context 中获取 login 函数

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            const response = await loginUser(formData);

            // 4. 登录成功后，调用 context 的 login 函数
            // 将 token 和 user 信息存入全局状态和 localStorage
            login(response.data.token, response.data.user);

            alert('登录成功！');
            navigate('/'); // 登录成功后跳转到主页
        } catch (err) {
            setError(err.response?.data?.error || '登录失败，请检查你的凭证。');
        } finally {
            setLoading(false);
        }
    };

    // ... (return 部分的 JSX 保持不变)
    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>登录</h2>
                <div className="form-group">
                    <label htmlFor="email">邮箱地址</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">密码</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? '登录中...' : '登录'}
                </button>
                <p className="switch-form-text">
                    还没有账户？ <Link to="/register">点此注册</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;