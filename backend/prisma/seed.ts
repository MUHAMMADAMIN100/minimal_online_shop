import { PrismaClient, Category, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const products = [
  {
    title: 'Классические шерстяные брюки',
    description: 'Элегантные мужские брюки из шерстяной ткани для делового стиля.',
    price: 8900,
    image:
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    category: Category.PANTS,
    sizes: ['30', '32', '34', '36'],
  },
  {
    title: 'Джинсы slim fit',
    description: 'Современные мужские джинсы прямого кроя. Комфорт весь день.',
    price: 6500,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    category: Category.PANTS,
    sizes: ['30', '32', '34'],
  },
  {
    title: 'Чинос бежевые',
    description: 'Универсальные чинос на все случаи жизни.',
    price: 5400,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    category: Category.PANTS,
    sizes: ['30', '32', '34', '36'],
  },
  {
    title: 'Кожаные броги',
    description: 'Классические мужские кожаные туфли ручной работы.',
    price: 14900,
    image:
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
    category: Category.SHOES,
    sizes: ['40', '41', '42', '43', '44'],
  },
  {
    title: 'Белые кеды',
    description: 'Минималистичные белые кожаные кеды для casual образа.',
    price: 7900,
    image:
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
    category: Category.SHOES,
    sizes: ['41', '42', '43', '44'],
  },
  {
    title: 'Кроссовки беговые',
    description: 'Лёгкие беговые кроссовки с амортизацией.',
    price: 9800,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    category: Category.SHOES,
    sizes: ['41', '42', '43'],
  },
  {
    title: 'Белая хлопковая рубашка',
    description: 'Классическая белая рубашка из 100% хлопка.',
    price: 4900,
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    category: Category.SHIRTS,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    title: 'Голубая рубашка oxford',
    description: 'Стильная рубашка oxford в голубом цвете.',
    price: 5400,
    image:
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80',
    category: Category.SHIRTS,
    sizes: ['S', 'M', 'L'],
  },
  {
    title: 'Рубашка в клетку',
    description: 'Фланелевая рубашка в клетку для casual стиля.',
    price: 4200,
    image:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    category: Category.SHIRTS,
    sizes: ['M', 'L', 'XL'],
  },
  {
    title: 'Кожаная куртка',
    description: 'Мужская кожаная куртка байкерского кроя.',
    price: 24900,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: Category.OUTERWEAR,
    sizes: ['M', 'L', 'XL'],
  },
  {
    title: 'Пальто шерстяное',
    description: 'Классическое мужское шерстяное пальто длиной до колена.',
    price: 22500,
    image:
      'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80',
    category: Category.OUTERWEAR,
    sizes: ['M', 'L', 'XL'],
  },
  {
    title: 'Пуховик зимний',
    description: 'Тёплый пуховик для суровой зимы.',
    price: 18900,
    image:
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80',
    category: Category.OUTERWEAR,
    sizes: ['M', 'L', 'XL', 'XXL'],
  },
];

async function main() {
  console.log('Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shop.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        name: 'Admin',
        role: Role.ADMIN,
      },
    });
    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  }

  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({ data: products });
    console.log(`Created ${products.length} products`);
  } else {
    console.log('Products already seeded');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
