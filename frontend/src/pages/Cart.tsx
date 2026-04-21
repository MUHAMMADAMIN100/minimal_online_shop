import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../store/cart';
import { useAuth } from '../store/auth';

export default function Cart() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const total = useCart((s) => s.total());
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-max py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-brand-200 mb-6" />
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Корзина пуста</h1>
        <p className="text-brand-200 mb-8">Добавьте товары из каталога, чтобы оформить заказ</p>
        <Link to="/" className="btn-primary">
          К каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Корзина</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          {items.map((i) => (
            <div
              key={`${i.productId}-${i.size || ''}`}
              className="card p-4 flex gap-4 items-center"
            >
              <img
                src={i.image}
                alt={i.title}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-brand-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2">{i.title}</h3>
                {i.size && (
                  <p className="text-xs text-brand-200 mt-1">Размер: {i.size}</p>
                )}
                <p className="font-bold mt-2">{i.price.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="inline-flex items-center gap-1 border border-brand-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(i.productId, i.quantity - 1, i.size)}
                    className="w-9 h-9 hover:bg-brand-100 flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-semibold text-sm">{i.quantity}</span>
                  <button
                    onClick={() => setQty(i.productId, i.quantity + 1, i.size)}
                    className="w-9 h-9 hover:bg-brand-100 flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => remove(i.productId, i.size)}
                  className="text-brand-200 hover:text-red-600 transition"
                  aria-label="Удалить"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-bold mb-4">Итого</h2>
          <div className="flex justify-between mb-2 text-brand-200">
            <span>Товаров</span>
            <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-2xl font-extrabold pt-4 border-t border-brand-100">
            <span>К оплате</span>
            <span>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <button
            onClick={() => {
              if (!user) navigate('/login');
              else navigate('/checkout');
            }}
            className="btn-primary w-full !py-4 mt-6"
          >
            Оформить заказ
          </button>
          {!user && (
            <p className="text-xs text-brand-200 mt-3 text-center">
              Для оформления необходимо войти
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
