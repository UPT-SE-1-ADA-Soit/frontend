import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { InputField } from '@/components/InputField.jsx';
import { useAuth } from '@/context/auth.jsx';
import styles from './Auth.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('alice@example.com');
  const [password, setPassword] = useState('password');
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    if (!password.trim()) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await login(email.trim(), password);
    navigate('/');
  }

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.back}
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={20} />
      </button>

      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.brandIcon}>M</span>
          <h1 className={styles.brand}>Marketa</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>

        <p className={styles.hint}>
          Try <code>alice@example.com</code>, <code>bob@example.com</code>, or
          any email — this is a mock auth.
        </p>
      </div>
    </div>
  );
}
