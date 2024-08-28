import {
  createAgent,
  ICredentialPlugin,
  IDataStore,
  IDataStoreORM,
  IDIDManager,
  IKeyManager,
  IMessageHandler,
  IResolver,
  TAgent,
} from '@veramo/core'
import { ISelectiveDisclosure } from '@veramo/selective-disclosure'
import { AgentRestClient } from '@veramo/remote-client'
import config from '../core/config/index.js'

export default async function getDIDAgent(): Promise<
  TAgent<
    IResolver &
      IKeyManager &
      IDIDManager &
      IDataStore &
      IDataStoreORM &
      IMessageHandler &
      ICredentialPlugin &
      ISelectiveDisclosure
  >
> {
  const response = await fetch(config.DID_AGENT_BASE_URL)
  const schema: any = await response.json()

  const agent = createAgent<
    IResolver &
      IKeyManager &
      IDIDManager &
      IDataStore &
      IDataStoreORM &
      IMessageHandler &
      ICredentialPlugin &
      ISelectiveDisclosure
  >({
    plugins: [
      new AgentRestClient({
        url: schema.servers[0].url,
        headers: {
          Authorization: config.DID_AGENT_API_KEY,
        },
        enabledMethods: Object.keys(schema['x-methods']),
        schema,
      }),
    ],
  })
  return agent
}
