import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../store/auth';

export default function Register() {
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);
  const loading = useAuth((s) => s.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      toast.success('Регистрация прошла успешно');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="container-max py-16 flex justify-center">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Регистрация</h1>
        <p className="text-brand-200 mb-8">Создайте аккаунт за минуту</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
              Имя
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Иван"
            />
          </div>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Минимум 6 символов"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full !py-4">
            {loading ? 'Создаём...' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-brand-200">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-brand-900 font-semibold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
