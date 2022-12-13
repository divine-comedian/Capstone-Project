import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { SalesService } from './sales.service'
import { CreateSaleDto } from './create-sale.dto'
import { Sale } from './sale.interface'

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto) {
    await this.salesService.create(createSaleDto)
  }

  @Get()
  async findAll(): Promise<Sale[]> {
    return this.salesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.salesService.delete(id)
  }
}
