import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { SalesService } from './sales.service'
import { CreateSaleDto } from './create-sale.dto'
import { Sale } from './sale.interface'
import { ApiOperation } from '@nestjs/swagger'

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get(':id')
  @ApiOperation({
    description: 'Return a specific sale given a sale contract address.',
  })
  async findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id)
  }

  @Get()
  @ApiOperation({ description: 'Return all sales.' })
  async findAll(): Promise<Sale[]> {
    return this.salesService.findAll()
  }

  @Post()
  @ApiOperation({
    description:
      'Add a single sale document to the database with contract address as _id',
  })
  async create(@Body() createSaleDto: CreateSaleDto) {
    createSaleDto._id = createSaleDto.sale_contract_addr
    await this.salesService.create(createSaleDto)
  }

  @Put(':id')
  @ApiOperation({ description: 'Update any sale document given an _id.' })
  async update(@Param('id') id: string, @Body() updateSaleDto: CreateSaleDto) {
    return await this.salesService.update(id, updateSaleDto)
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a specific document using an _id.' })
  async delete(@Param('id') id: string) {
    return this.salesService.delete(id)
  }

  @Delete()
  @ApiOperation({
    description: 'Delete all documents in the database!',
  })
  async deleteAll() {
    return this.salesService.deleteAll()
  }
}
