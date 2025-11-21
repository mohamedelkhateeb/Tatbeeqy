import { EntityRepository, Repository } from 'typeorm'
import { PlatformSetting } from './entities/platform.entity'

@EntityRepository(PlatformSetting)
export class PlatformRepository extends Repository<PlatformSetting> {
  async findByKey(key: string) {
    return this.findOne({ where: { key } })
  }
}
