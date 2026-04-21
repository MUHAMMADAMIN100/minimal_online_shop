import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    if (!dto.items?.length) throw new BadRequestException('Корзина пуста');

    const ids = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({ where: { id: { in: ids } } });
    if (products.length !== ids.length) throw new BadRequestException('Некоторые товары не найдены');

    const priceMap = new Map(products.map((p) => [p.id, p.price]));
    const titleMap = new Map(products.map((p) => [p.id, p.title]));

    let total = 0;
    const itemsData = dto.items.map((i) => {
      const price = priceMap.get(i.productId)!;
      total += price * i.quantity;
      return {
        productId: i.productId,
        quantity: i.quantity,
        price,
        size: i.size,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        lat: dto.lat,
        lng: dto.lng,
        items: { create: itemsData },
      },
      include: { items: { include: { product: true } } },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const lines = order.items
      .map(
        (it) =>
          `• ${titleMap.get(it.productId) || it.product?.title} x${it.quantity}${
            it.size ? ` (${it.size})` : ''
          } — ${it.price * it.quantity} ₽`,
      )
      .join('\n');

    const mapsLink =
      dto.lat && dto.lng
        ? `\n📍 <a href="https://www.google.com/maps?q=${dto.lat},${dto.lng}">Точка на карте</a>`
        : '';

    const text =
      `🛒 <b>Новый заказ</b>\n` +
      `ID: ${order.id}\n` +
      `👤 ${dto.name} (${user?.email || '-'})\n` +
      `📞 ${dto.phone}\n` +
      `🏠 ${dto.address}${mapsLink}\n\n` +
      `${lines}\n\n` +
      `💰 <b>Итого: ${total} ₽</b>`;

    await this.telegram.sendMessage(text);

    return order;
  }

  async findMine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Заказ не найден');
    if (order.userId !== userId) throw new NotFoundException('Заказ не найден');
    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } }, user: { select: { email: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
