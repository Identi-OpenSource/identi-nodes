import { createAgent, TAgent } from '@veramo/core'
import { AgentRestClient } from '@veramo/remote-client'
import { IIdentiKeyManager } from '../interfaces/IIdentiKeyManager.js'
import config from '../core/config/index.js'

export async function getCryptoAgent(): Promise<TAgent<IIdentiKeyManager>> {
  const response = await fetch(`${config.CRYPTO_AGENT_BASE_URL}/open-api.json`)
  const schema: any = await response.json()

  const agent = createAgent<IIdentiKeyManager>({
    plugins: [
      new AgentRestClient({
        url: `${config.CRYPTO_AGENT_BASE_URL}/agent`,
        headers: {
          Authorization: config.CRYPTO_AGENT_API_KEY,
        },
        enabledMethods: Object.keys(schema['x-methods']),
        schema,
      }),
    ],
  })
  return agent
}
