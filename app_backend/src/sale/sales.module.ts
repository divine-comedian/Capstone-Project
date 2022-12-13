import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SalesController } from './sales.controller'
import { SalesService } from './sales.service'
import { SaleSchema } from './sale.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'sales', schema: SaleSchema }])],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
