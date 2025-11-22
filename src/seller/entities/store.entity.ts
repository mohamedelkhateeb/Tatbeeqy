import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Seller } from './seller.entity'

@Entity()
export class Store {
  @PrimaryGeneratedColumn('identity')
  id: number

  @Column({ type: 'text' })
  storeName: string

  @Column({ type: 'text', nullable: true })
  logo: string // رابط الصورة أو مسارها

  @Column({ type: 'text', nullable: true })
  businessActivity: string // النشاط التجاري

  @Column({ type: 'text', nullable: true })
  entityType: string // فرد — مؤسسة — شركة — مؤسسة خيرية

  @OneToOne(() => Seller, (seller) => seller.store)
  seller: Seller
}
