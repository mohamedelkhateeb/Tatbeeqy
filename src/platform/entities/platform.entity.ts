import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('platform_settings')
export class PlatformSetting {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ unique: true })
  key: string
  @Column({ type: 'text', nullable: true })
  value: string
  @Column({ default: false })
  isPublic: boolean // public-facing settings (currency, theme, etc.)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date
}
