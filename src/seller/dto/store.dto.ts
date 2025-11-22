export class CreateStoreDto {
  storeName: string
  logo?: string
  businessActivity?: string
  entityType?: string // فرد، مؤسسة، شركة...
}
