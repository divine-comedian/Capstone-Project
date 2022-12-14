import { Document } from 'mongoose'

export interface Recipient extends Document {
  readonly recipient_name: string
  readonly recipient_desc: string
  readonly recipient_addr: string
}

export interface Sale extends Document {
  _id: string
  readonly sale_contract_addr: string
  readonly name_of_sale: string
  readonly type_of_sale: string
  readonly description: string
  readonly recipient: Recipient
  readonly closing_time: Date
  readonly bet_price: number
  readonly starting_bid: number
  readonly highest_bid: number
  readonly image_ipfs_url: string
}
