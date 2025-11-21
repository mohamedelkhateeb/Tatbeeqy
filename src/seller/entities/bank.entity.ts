import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Seller } from './seller.entity'

@Entity()
export class Bank {
  @PrimaryGeneratedColumn('identity')
  id: number

  @Column({ type: 'text' })
  bankName: string

  @Column({ type: 'text' })
  accountHolder: string

  @Column({ type: 'text' })
  accountNumber: string

  @Column({ type: 'text', nullable: true })
  iban: string

  @OneToOne(() => Seller, (seller) => seller.bank)
  seller: Seller
}
