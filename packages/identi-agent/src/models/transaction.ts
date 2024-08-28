import { DataTypes, Model } from 'sequelize'
import sequelize from '../core/database/connection.js'

export interface ITransaction extends Model {
  id: string
  from_wallet_id: string
  to_wallet_id: string
  amount: number
  transaction_date: Date
  status: 'PENDING' | 'SUCCESS' | 'FAIL' | 'REVERTED'
  transaction_hash: string
}

const TransactionModel = sequelize.define<ITransaction>(
  'Transactions',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: true,
    },
    from_wallet_id: {
      type: DataTypes.STRING(255),
    },
    to_wallet_id: {
      type: DataTypes.STRING(255),
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    transaction_date: {
      type: DataTypes.DATE,
    },
    transaction_hash: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.ENUM,
      values: ['PENDING', 'SUCCESS', 'FAIL', 'REVERTED'],
    },
  },
  {
    schema: 'blockchain',
    tableName: 'Transactions',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

export default TransactionModel
