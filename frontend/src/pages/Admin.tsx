import { FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../api';
import type { Category, Product } from '../types';
import { CATEGORIES, CATEGORY_LABELS } from '../types';

type FormState = {
  id?: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category: Category;
  sizes: string;
  stock: string;
};

const emptyForm: FormState = {
  title: '',
  description: '',
  price: '',
  image: '',
  category: 'SHIRTS',
  sizes: '',
  stock: '10',
};

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get<Product[]>('/products', { params });
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const openCreate = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id,
      title: p.title,
      description: p.description,
      price: String(p.price),
      image: p.image,
      category: p.category,
      sizes: p.sizes.join(', '),
      stock: String(p.stock),
    });
    setShowModal(true);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        image: form.image,
        category: form.category,
        sizes: form.sizes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        stock: Number(form.stock),
      };
      if (form.id) {
        await api.patch(`/products/${form.id}`, payload);
        toast.success('Товар обновлён');
      } else {
        await api.post('/products', payload);
        toast.success('Товар создан');
      }
      setShowModal(false);
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Удалено');
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Ошибка удаления');
    }
  };

  return (
    <div className="container-max py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Админ-панель</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} /> Добавить товар
        </button>
      </div>

      <div className="card p-5 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-200"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию и описанию..."
            className="input pl-11"
          />
        </div>
        <select
          value={category || ''}
          onChange={(e) => setCategory((e.target.value || null) as Category | null)}
          className="input md:w-60"
        >
          <option value="">Все категории</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-100 text-left">
                <th className="p-4 font-semibold">Товар</th>
                <th className="p-4 font-semibold">Категория</th>
                <th className="p-4 font-semibold">Цена</th>
                <th className="p-4 font-semibold">Остаток</th>
                <th className="p-4 font-semibold text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-200">
                    Загрузка...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-200">
                    Товары не найдены
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t border-brand-100 hover:bg-brand-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-14 h-14 rounded-lg object-cover bg-brand-100"
                        />
                        <div className="min-w-0">
                          <p className="font-medium line-clamp-1">{p.title}</p>
                          <p className="text-xs text-brand-200 line-clamp-1">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{CATEGORY_LABELS[p.category]}</td>
                    <td className="p-4 font-semibold">
                      {p.price.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg hover:bg-brand-100 transition"
                          aria-label="Редактировать"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                          aria-label="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-cardHover w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-brand-100 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">
                {form.id ? 'Редактировать' : 'Новый товар'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-brand-100"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                  Название
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                  Описание
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                  URL изображения
                </label>
                <input
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="input"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                    Цена (₽)
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                    Остаток
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                  Категория
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as Category })
                  }
                  className="input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-brand-200 uppercase tracking-wider mb-1.5 block">
                  Размеры (через запятую)
                </label>
                <input
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className="input"
                  placeholder="S, M, L, XL"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button disabled={saving} className="btn-primary flex-1" type="submit">
                  {saving ? 'Сохранение...' : form.id ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
