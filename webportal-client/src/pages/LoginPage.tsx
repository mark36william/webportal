import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <AuthForm
      isLogin={isLogin}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      onToggleMode={handleToggleMode}
    />
  );
};

export default LoginPage;
