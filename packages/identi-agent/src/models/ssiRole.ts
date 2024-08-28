import { DataTypes, Model } from 'sequelize'
import sequelize from '../core/database/connection.js'

export interface ISSIRole extends Model {
  id: string
  wallet_id: string
  status: 'ISSUER' | 'VERIFIER'
}

const SSIRoleModel = sequelize.define<ISSIRole>(
  'SSIRoles',
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    wallet_id: {
      type: DataTypes.STRING(255),
      references: {
        model: 'MasterWallets',
        key: 'id_wallet',
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ['ISSUER', 'VERIFIER'],
    },
  },
  {
    schema: 'blockchain',
    tableName: 'SSIRoles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

export default SSIRoleModel
