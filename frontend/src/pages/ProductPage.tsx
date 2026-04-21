import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Product } from '../types';
import { CATEGORY_LABELS } from '../types';
import { useCart } from '../store/cart';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const add = useCart((s) => s.add);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<Product>(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setSize(data.sizes[0]);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container-max py-10 grid md:grid-cols-2 gap-10">
        <div className="aspect-[4/5] bg-brand-100 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-brand-100 animate-pulse rounded w-3/4" />
          <div className="h-6 bg-brand-100 animate-pulse rounded w-1/3" />
          <div className="h-32 bg-brand-100 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAdd = () => {
    add({
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      quantity: qty,
      size,
    });
    toast.success('Добавлено в корзину');
  };

  return (
    <div className="container-max py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-brand-200 hover:text-brand-900 mb-6 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Назад к каталогу
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-brand-100">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xs uppercase font-semibold tracking-widest text-accent-600 mb-3">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">{product.title}</h1>
          <p className="text-3xl font-bold mb-6">
            {product.price.toLocaleString('ru-RU')} ₽
          </p>
          <p className="text-brand-200 leading-relaxed mb-8">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-xs uppercase font-semibold tracking-wider text-brand-200 mb-3">
                Размер
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
                      size === s
                        ? 'border-brand-900 bg-brand-900 text-white'
                        : 'border-brand-200 bg-white hover:border-brand-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-xs uppercase font-semibold tracking-wider text-brand-200 mb-3">
              Количество
            </p>
            <div className="inline-flex items-center gap-1 border border-brand-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-11 h-11 hover:bg-brand-100 transition"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-11 h-11 hover:bg-brand-100 transition"
              >
                +
              </button>
            </div>
          </div>

          <button onClick={handleAdd} className="btn-primary w-full md:w-auto md:px-10 !py-4">
            <ShoppingBag size={18} /> Добавить в корзину
          </button>

          <div className="mt-8 pt-8 border-t border-brand-100 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-accent-600" /> Оригинальный товар
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-accent-600" /> Доставка по всей стране
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-accent-600" /> Возврат 14 дней
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-accent-600" /> Премиальное качество
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
