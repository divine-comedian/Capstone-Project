import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Sale } from './sale.interface'
import { CreateSaleDto } from './create-sale.dto'

@Injectable()
export class SalesService {
  constructor(@InjectModel('sales') private readonly saleModel: Model<any>) {}

  async create(CreateSaleDto: CreateSaleDto): Promise<Sale> {
    const createdSale = new this.saleModel(CreateSaleDto)
    return await createdSale.save()
  }

  async findAll(): Promise<Sale[]> {
    return this.saleModel.find().exec()
  }

  async findOne(saleContractAddress: string): Promise<Sale> {
    return this.saleModel
      .findOne({ sale_contract_addr: saleContractAddress })
      .exec()
  }

  async update(filter: CreateSaleDto, updateSaleDto: CreateSaleDto) {
    return await this.saleModel
      .findOneAndUpdate(filter, updateSaleDto, {
        new: true,
      })
      .exec()
  }

  async delete(saleContractAddress: string) {
    const deletedSale = await this.saleModel
      .findOneAndDelete({ sale_contract_addr: saleContractAddress })
      .exec()
    return deletedSale
  }

  async deleteAll() {
    return await this.saleModel.deleteMany({}).exec()
  }
}
