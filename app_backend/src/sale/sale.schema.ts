import * as mongoose from 'mongoose'

export const RecipientSchema = new mongoose.Schema({
  recipient_name: String,
  recipient_desc: String,
  recipient_addr: String,
})

export const SaleSchema = new mongoose.Schema({
  sale_contract_addr: String,
  name_of_sale: String,
  type_of_sale: String,
  description: String,
  recipient: RecipientSchema,
  closing_time: Date,
  bet_price: String,
  highestBid: String,
  image_ipfs_url: String,
})
