class Recipient {
  readonly recipient_name: string
  readonly recipient_desc: string
  readonly recipient_addr: string
}

export class CreateSaleDto {
  _id: string
  readonly sale_contract_addr: string
  readonly name_of_sale: string
  readonly type_of_sale: string
  readonly description: string
  readonly recipient: Recipient
  readonly closing_time: Date
  readonly bet_price: string
  readonly highestBid: string
  readonly image_ipfs_url: string
}
