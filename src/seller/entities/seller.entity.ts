import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm'

import { User } from '@/user/model/user.entity'
import { Bank } from './bank.entity'
import { Store } from './store.entity'

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'boolean', default: false })
  isVerified: boolean

  @Column({ type: 'boolean', default: false })
  isBanned: boolean

  @OneToOne(() => Bank, (bank) => bank.seller, {
    cascade: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  bank: Relation<Bank> | null

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Relation<User>

  @OneToOne(() => Store, (store) => store.seller, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  store: Relation<Store>

  @Column({ type: 'int', default: 0 })
  totalReviews: number

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date
}
