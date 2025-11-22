import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Seller } from './seller.entity'

@Entity('banks')
export class Bank {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  bankName: string | null

  @Column({ type: 'varchar', length: 255, nullable: true })
  accountHolder: string | null

  @Column({ type: 'varchar', length: 100, nullable: true })
  accountNumber: string | null

  @Column({ type: 'varchar', length: 34, nullable: true })
  iban: string | null

  @OneToOne(() => Seller, (seller) => seller.bank)
  seller: Seller
}
