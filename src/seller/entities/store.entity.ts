import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Seller } from './seller.entity'

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'varchar', length: 255 })
  storeName: string

  @Column({ type: 'varchar', length: 20 })
  phone: string

  @Column({ type: 'text', nullable: true })
  logo: string | null

  @Column({ type: 'text', nullable: true })
  banner: string | null

  @Column({ type: 'text' })
  address: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  businessActivity: string | null

  @Column({
    type: 'enum',
    enum: ['individual', 'establishment', 'company', 'charity'],
  })
  entityType: 'individual' | 'establishment' | 'company' | 'charity'

  @Column({ type: 'varchar', length: 160, nullable: true })
  metaTitle: string | null

  @Column({ type: 'text', nullable: true })
  metaDescription: string | null

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @OneToOne(() => Seller, (seller) => seller.store)
  seller: Seller
}
