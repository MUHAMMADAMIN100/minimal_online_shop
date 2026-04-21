import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../api';
import type { Category, Product } from '../types';
import { CATEGORIES, CATEGORY_LABELS } from '../types';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await api.get<Product[]>('/products', { params });
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(loadProducts, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, minPrice, maxPrice, sort]);

  const hasFilters = useMemo(
    () => !!(search || category || minPrice || maxPrice),
    [search, category, minPrice, maxPrice],
  );

  const resetFilters = () => {
    setSearch('');
    setCategory(null);
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-600 to-brand-900 text-white">
        <div className="container-max py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-accent-500 text-sm font-semibold uppercase tracking-[0.25em] mb-4">
              Коллекция 2026
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Стиль, который говорит <span className="text-accent-500">за тебя</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              Премиальная мужская одежда: брюки, рубашки, обувь и верхняя одежда. Отобраны лучшие
              материалы и силуэты.
            </p>
            <a href="#catalog" className="btn-accent">
              Смотреть каталог
            </a>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="container-max py-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Каталог</h2>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="input pl-11"
                />
              </div>
              <button
                className="btn-outline !px-4"
                onClick={() => setShowFilters((v) => !v)}
                aria-label="Фильтры"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            <button
              className={`chip ${!category ? 'chip-active' : ''}`}
              onClick={() => setCategory(null)}
            >
              Все
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? 'chip-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl border border-brand-100 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                  Цена от
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="input"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                  Цена до
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="100000"
                  className="input"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                  Сортировка
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="input"
                >
                  <option value="newest">Сначала новые</option>
                  <option value="price_asc">По возрастанию цены</option>
                  <option value="price_desc">По убыванию цены</option>
                </select>
              </div>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="sm:col-span-3 btn-ghost !justify-start !px-0"
                >
                  <X size={16} /> Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="aspect-[4/5] bg-brand-100 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-brand-100 animate-pulse rounded" />
                    <div className="h-4 w-20 bg-brand-100 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-brand-200">
              <p className="text-xl font-semibold text-brand-900 mb-2">Ничего не найдено</p>
              <p>Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
