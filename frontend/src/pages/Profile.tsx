import { Link, useNavigate } from 'react-router-dom';
import { Package, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../store/auth';

export default function Profile() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="container-max py-10 max-w-2xl">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Мой профиль</h1>

      <div className="card p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-100">
          <div className="w-16 h-16 rounded-full bg-brand-900 text-white text-2xl font-bold flex items-center justify-center">
            {(user.name || user.email)[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold">{user.name || 'Без имени'}</p>
            <p className="text-brand-200 text-sm">{user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-0.5 rounded-full bg-accent-500 text-white font-semibold">
                <Shield size={12} /> Администратор
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Link
            to="/orders"
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-brand-100 transition"
          >
            <Package size={20} />
            <span className="font-medium">Мои заказы</span>
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-brand-100 transition text-accent-600"
            >
              <Shield size={20} />
              <span className="font-medium">Админ-панель</span>
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-50 text-red-600 transition"
          >
            <LogOut size={20} />
            <span className="font-medium">Выйти</span>
          </button>
        </div>
      </div>
    </div>
  );
}
