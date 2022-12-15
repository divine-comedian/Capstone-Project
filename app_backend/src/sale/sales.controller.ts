import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { SalesService } from './sales.service'
import { CreateSaleDto } from './create-sale.dto'
import { Sale } from './sale.interface'
import { ApiOperation } from '@nestjs/swagger'

@Controller('api/sales')
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
    description: 'Add a single sale document to the database.',
  })
  async create(@Body() createSaleDto: CreateSaleDto) {
    createSaleDto._id = createSaleDto.sale_contract_addr
    await this.salesService.create(createSaleDto)
  }

  @Put(':filter')
  @ApiOperation({
    description:
      'Update any sale document given a json to use as a matching filter.',
  })
  async update(
    @Param('filter') filter: string,
    @Body() updateSaleDto: CreateSaleDto,
  ) {
    const filterObj: CreateSaleDto = JSON.parse(filter)
    return await this.salesService.update(filterObj, updateSaleDto)
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
