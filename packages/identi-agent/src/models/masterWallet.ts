import { DataTypes, Model } from 'sequelize'

import sequelize from '../core/database/connection.js'

export interface IWallet {
  id_wallet: string
  did: string
  crypto_wallet_kid: string
  voice_biometric: string
}

const MasterWalletModel = sequelize.define(
  'MasterWallets',
  {
    id_wallet: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    did: {
      type: DataTypes.STRING,
    },
    crypto_wallet_kid: {
      type: DataTypes.STRING,
    },
    voice_biometric: {
      type: DataTypes.STRING,
    },
  },
  {
    schema: 'blockchain',
    tableName: 'MasterWallets',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

export default MasterWalletModel
