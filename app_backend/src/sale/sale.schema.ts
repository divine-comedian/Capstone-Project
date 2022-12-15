import * as mongoose from 'mongoose'

export const RecipientSchema = new mongoose.Schema(
  {
    recipient_name: String,
    recipient_desc: String,
    recipient_addr: String,
  },
  { versionKey: false },
)

export const SaleSchema = new mongoose.Schema(
  {
    _id: String,
    sale_contract_addr: String,
    name_of_sale: String,
    type_of_sale: String,
    description: String,
    recipient: RecipientSchema,
    closing_time: Date,
    bet_price: Number,
    starting_bid: Number,
    highest_bid: Number,
    ipfs_hash: String,
    image_ipfs_url: String,
  },
  { versionKey: false },
)
