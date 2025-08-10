import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

interface AuthFormProps {
  isLogin?: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin = true,
  onSubmit,
  loading,
  error,
  onToggleMode,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await onSubmit(email, password);
    } catch (err) {
      // Error is handled by the parent component
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {isLogin ? 'Sign In' : 'Create Account'}
        </Typography>

        {(error || formError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || formError}
          </Alert>
        )}

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register'}
        </Button>

        <Box textAlign="center">
          <Button
            onClick={onToggleMode}
            color="primary"
            size="small"
            disabled={loading}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;
