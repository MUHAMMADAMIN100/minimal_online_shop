import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Order } from '../types';

const STATUS_LABEL: Record<Order['status'], { text: string; color: string }> = {
  PENDING: { text: 'В обработке', color: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { text: 'Подтверждён', color: 'bg-blue-100 text-blue-700' },
  SHIPPED: { text: 'Отправлен', color: 'bg-indigo-100 text-indigo-700' },
  DELIVERED: { text: 'Доставлен', color: 'bg-green-100 text-green-700' },
  CANCELLED: { text: 'Отменён', color: 'bg-red-100 text-red-700' },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order[]>('/orders/mine')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container-max py-10 text-brand-200">Загрузка...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container-max py-20 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">Пока нет заказов</h1>
        <p className="text-brand-200 mb-6">После оформления заказа он появится здесь</p>
        <Link to="/" className="btn-primary">
          К каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Мои заказы</h1>
      <div className="space-y-4">
        {orders.map((o) => {
          const st = STATUS_LABEL[o.status];
          return (
            <div key={o.id} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-brand-200">Заказ</p>
                  <p className="font-mono text-sm">{o.id}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${st.color}`}>
                  {st.text}
                </span>
                <p className="text-sm text-brand-200">
                  {new Date(o.createdAt).toLocaleString('ru-RU')}
                </p>
                <p className="text-lg font-bold">{o.total.toLocaleString('ru-RU')} ₽</p>
              </div>

              <div className="grid sm:grid-cols-[1fr_1fr] gap-4 mb-4 text-sm">
                <div>
                  <span className="text-brand-200">Получатель:</span> {o.name}
                </div>
                <div>
                  <span className="text-brand-200">Телефон:</span> {o.phone}
                </div>
                <div className="sm:col-span-2">
                  <span className="text-brand-200">Адрес:</span> {o.address}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-brand-100">
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 text-sm">
                    {it.product && (
                      <img
                        src={it.product.image}
                        alt={it.product.title}
                        className="w-12 h-12 rounded-lg object-cover bg-brand-100"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">
                        {it.product?.title || 'Товар'}
                      </p>
                      <p className="text-xs text-brand-200">
                        {it.quantity} × {it.price.toLocaleString('ru-RU')} ₽
                        {it.size ? ` · ${it.size}` : ''}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {(it.price * it.quantity).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
