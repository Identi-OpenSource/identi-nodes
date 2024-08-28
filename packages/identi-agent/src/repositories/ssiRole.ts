import { SSIRoleModel } from '../models/index.js'

class SSIRoleRepository {
  private model: typeof SSIRoleModel

  constructor() {
    this.model = SSIRoleModel
  }
  async create(data: any): Promise<any> {
    try {
      await this.model.create(data)
      return true
    } catch (error) {
      throw error
    }
  }

  async update(data: any, where: any): Promise<any> {
    try {
      await this.model.update(data, where)
      return true
    } catch (error) {
      throw error
    }
  }

  async findOne(data: any): Promise<any> {
    return await this.model.findOne(data)
  }
}

export default new SSIRoleRepository()
