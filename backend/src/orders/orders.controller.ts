import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @UseGuards(AdminGuard)
  @Get('all')
  all() {
    return this.orders.findAll();
  }

  @Get('mine')
  mine(@CurrentUser() user: { id: string }) {
    return this.orders.findMine(user.id);
  }

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateOrderDto) {
    return this.orders.create(user.id, dto);
  }

  @Get(':id')
  one(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.orders.findOneForUser(user.id, id);
  }
}
