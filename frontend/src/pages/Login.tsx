import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../store/auth';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const loading = useAuth((s) => s.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Вы вошли');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="container-max py-16 flex justify-center">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Вход</h1>
        <p className="text-brand-200 mb-8">Рады видеть вас снова</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
              Пароль
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full !py-4">
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-brand-200">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-brand-900 font-semibold hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
