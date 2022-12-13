import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { SalesService } from './sales.service'
import { CreateSaleDto } from './create-sale.dto'
import { Sale } from './sale.interface'

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id)
  }

  @Get()
  async findAll(): Promise<Sale[]> {
    return this.salesService.findAll()
  }

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto) {
    await this.salesService.create(createSaleDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.salesService.delete(id)
  }

  @Delete()
  async deleteAll() {
    return this.salesService.deleteAll()
  }
}
