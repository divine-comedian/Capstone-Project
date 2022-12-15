class Recipient {
  readonly recipient_name: string
  readonly recipient_desc: string
  readonly recipient_addr: string
  readonly recipient_link: string
}

export class CreateSaleDto {
  readonly sale_contract_addr: string
  readonly name_of_sale: string
  readonly type_of_sale: string
  readonly description: string
  readonly recipient: Recipient
  readonly closing_time: Date
  readonly bet_price: number
  readonly starting_bid: number
  readonly highest_bid: number
  readonly ipfs_hash: string
  readonly image_ipfs_url: string
}
