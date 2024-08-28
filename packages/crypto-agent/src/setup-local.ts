import { createAgent, IDataStore, IDataStoreORM, IKeyManager, IResolver } from '@veramo/core'
import { Entities, KeyStore, migrations, PrivateKeyStore } from '@veramo/data-store'

import { DataSource } from 'typeorm'
import { SecretBox } from '@veramo/kms-local'
import IdentiKeyManager from './core/identi-key-manager.js'
import IdentiKeyManagementSystem from './core/identi-key-management-system.js'
import config from './core/config/index.js'

const dbConnection = new DataSource({
  type: 'postgres',
  url: config.DATABASE_URL,
  synchronize: false,
  migrationsRun: true,
  migrations,
  logging: false,
  entities: Entities,
}).initialize()

const defaultKms = 'local'

export const agent = createAgent<
  // these interfaces should match the plugins you add next. They are optional but very useful for auto-complete.
  IResolver & IKeyManager & IDataStore & IDataStoreORM
>({
  plugins: [
    // it's a good idea to add the corresponding plugin interface `types` to the `createAgent<types>`
    // it is optional, but very useful for auto-complete
    new IdentiKeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        [defaultKms]: new IdentiKeyManagementSystem(
          new PrivateKeyStore(dbConnection, new SecretBox(config.AGENT_SECRET_KEY))
        ),
      },
    }),
    // new DataStore(dbConnection),
    // new DataStoreORM(dbConnection),
  ],
})
