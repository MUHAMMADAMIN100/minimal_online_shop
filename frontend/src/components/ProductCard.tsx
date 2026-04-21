import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { CATEGORY_LABELS } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="card group overflow-hidden flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 text-[10px] uppercase font-semibold tracking-widest bg-white/95 backdrop-blur px-2.5 py-1 rounded-full">
          {CATEGORY_LABELS[product.category]}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-base leading-snug line-clamp-2 min-h-[2.6rem]">
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold">{product.price.toLocaleString('ru-RU')} ₽</span>
          <span className="text-xs text-brand-200">Подробнее →</span>
        </div>
      </div>
    </Link>
  );
}
