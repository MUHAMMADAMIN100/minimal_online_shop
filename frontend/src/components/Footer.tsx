export default function Footer() {
  return (
    <footer className="mt-24 border-t border-brand-100 bg-white">
      <div className="container-max py-10 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm text-brand-200">
        <div className="font-bold text-brand-900 text-lg tracking-tight">ATELIER</div>
        <div>© {new Date().getFullYear()} ATELIER. Все права защищены.</div>
        <div>Мужская одежда премиум-класса</div>
      </div>
    </footer>
  );
}
