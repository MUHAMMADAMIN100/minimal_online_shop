import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api';
import { useCart } from '../store/cart';
import { useAuth } from '../store/auth';
import MapPicker from '../components/MapPicker';

export default function Checkout() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Корзина пуста');
    if (!address) return toast.error('Укажите адрес');

    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', {
        name,
        phone,
        address,
        lat: pos?.lat,
        lng: pos?.lng,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
        })),
      });
      setOrderId(data.id);
      clear();
      toast.success('Заказ оформлен!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка оформления');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className="container-max py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Заказ оформлен!</h1>
        <p className="text-brand-200 mb-8">
          Номер заказа: <span className="font-mono text-brand-900">{orderId}</span>
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate('/orders')} className="btn-primary">
            Посмотреть заказ
          </button>
          <button onClick={() => navigate('/')} className="btn-outline">
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-max py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
        <button onClick={() => navigate('/')} className="btn-primary">
          К каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Оформление заказа</h1>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="card p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                Имя
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Иван Иванов"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                Телефон
              </label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
                placeholder="+7 900 000 00 00"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
              Адрес доставки
            </label>
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input"
              placeholder="Город, улица, дом, квартира"
            />
            <p className="text-xs text-brand-200 mt-1.5">
              Или выберите точку на карте — адрес заполнится автоматически
            </p>
          </div>

          <MapPicker
            value={pos}
            onChange={(p, addr) => {
              setPos(p);
              if (addr) setAddress(addr);
            }}
          />
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((i) => (
              <div
                key={`${i.productId}-${i.size}`}
                className="flex gap-3 items-center text-sm"
              >
                <img
                  src={i.image}
                  alt={i.title}
                  className="w-14 h-14 rounded-lg object-cover bg-brand-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{i.title}</p>
                  <p className="text-xs text-brand-200">
                    {i.quantity} × {i.price.toLocaleString('ru-RU')} ₽
                    {i.size ? ` · ${i.size}` : ''}
                  </p>
                </div>
                <p className="font-semibold">
                  {(i.price * i.quantity).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-2xl font-extrabold pt-5 mt-5 border-t border-brand-100">
            <span>Итого</span>
            <span>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <button disabled={submitting} className="btn-primary w-full !py-4 mt-6" type="submit">
            {submitting ? 'Оформляем...' : 'Оформить заказ'}
          </button>
        </aside>
      </form>
    </div>
  );
}
