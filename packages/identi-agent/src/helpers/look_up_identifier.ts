import config from '../core/config/index.js'
import ObfuscateIdentifierResource from '../services/obfuscate-identifier.js'

export default async function lookUpIdentifier(identifier: string): Promise<any> {
  const obfuscateIdentifierResource = new ObfuscateIdentifierResource({
    privateKey: config.CELO_PRIVATE_KEY,
    nodeUrl: config.CELO_NODE_URL,
  })

  const obfuscatedIdentifier = await obfuscateIdentifierResource.getObfuscatedIdentifier(identifier)

  const lookupIdentifier = await obfuscateIdentifierResource.lookupAttestations(undefined, obfuscatedIdentifier)
  if (!lookupIdentifier) {
    throw new Error('Identificador no registrado')
  }
  return lookupIdentifier
}
