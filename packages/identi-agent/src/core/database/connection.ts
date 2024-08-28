import { Dialect, Sequelize } from 'sequelize'
import config from '../config/index.js'
const { postgresURI } = config

const sequelize = new Sequelize(postgresURI.database, postgresURI.username, postgresURI.password, {
  dialect: postgresURI.dialect as Dialect,
  host: postgresURI.host,
  port: postgresURI.port,
})

export default sequelize
