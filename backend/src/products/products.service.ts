import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const where: any = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) where.category = query.category;
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sort === 'price_asc') orderBy = { price: 'asc' };
    if (query.sort === 'price_desc') orderBy = { price: 'desc' };

    return this.prisma.product.findMany({ where, orderBy });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Товар не найден');
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { ok: true };
  }
}
