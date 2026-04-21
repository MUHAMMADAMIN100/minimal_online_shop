import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogIn, UserPlus, LogOut, Shield, Package } from 'lucide-react';
import { useAuth } from '../store/auth';
import { useCart } from '../store/cart';

export default function Header() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const count = useCart((s) => s.count());
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-brand-100">
      <div className="container-max flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight">ATELIER</span>
          <span className="hidden sm:inline text-xs text-brand-200 font-medium uppercase tracking-widest">
            Men's Wear
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-brand-900' : 'text-brand-200 hover:text-brand-900'
              }`
            }
          >
            Каталог
          </NavLink>
          {user && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-900' : 'text-brand-200 hover:text-brand-900'
                }`
              }
            >
              Мои заказы
            </NavLink>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive ? 'text-accent-600' : 'text-accent-500 hover:text-accent-600'
                }`
              }
            >
              <Shield size={16} /> Админ
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl hover:bg-brand-100 transition-colors"
            aria-label="Корзина"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="p-2.5 rounded-xl hover:bg-brand-100 transition-colors"
                aria-label="Профиль"
              >
                <User size={20} />
              </Link>
              <Link
                to="/orders"
                className="md:hidden p-2.5 rounded-xl hover:bg-brand-100 transition-colors"
                aria-label="Заказы"
              >
                <Package size={20} />
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2.5 rounded-xl hover:bg-brand-100 transition-colors"
                aria-label="Выйти"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="p-2.5 rounded-xl hover:bg-brand-100 transition-colors"
                aria-label="Войти"
              >
                <LogIn size={20} />
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex btn-primary !px-4 !py-2 text-sm"
              >
                <UserPlus size={16} />
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
