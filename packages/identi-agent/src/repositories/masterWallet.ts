import { MasterWalletModel } from '../models/index.js'

class MasterWalletRepository {
  private walletModel: typeof MasterWalletModel

  constructor() {
    this.walletModel = MasterWalletModel
  }
  async create(data: any): Promise<any> {
    try {
      await this.walletModel.create(data)
      return true
    } catch (error) {
      throw error
    }
  }

  async update(data: any, where: any): Promise<any> {
    try {
      await this.walletModel.update(data, where)
      return true
    } catch (error) {
      throw error
    }
  }

  async findOne(data: any): Promise<any> {
    return await this.walletModel.findOne(data)
  }
}

export default new MasterWalletRepository()
