import { Request, Response } from 'express'
import getDIDAgent from '../../../services/did-agent.js'
import { MasterWalletRepository, SSIRoleRepository } from '../../../repositories/index.js'
import { add } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import getPeriod from '../../../utils/get_period.js'

export default class IssuerController {
  static async issueVerifiableCredential(req: Request, res: Response) {
    try {
      const { holder_did, credential_subject, credential_type, valid_period, is_return_hash } = req.body

      const holderDID = await MasterWalletRepository.findOne({ where: { did: holder_did } })
      if (!holderDID) return res.status(404).json({ error: 'Holder DID not found' })

      if (!req.jwtPayload.did) return res.status(404).json({ error: 'Issuer DID not found' })

      // Check issuer and verifier
      const IssuerDID = await MasterWalletRepository.findOne({ where: { did: req.jwtPayload.did } })
      if (!IssuerDID) return res.status(404).json({ error: 'Issuer DID not found' })
      const verifyRole = await SSIRoleRepository.findOne({
        where: { wallet_id: IssuerDID.id_wallet, disabled_at: null },
      })

      if (!verifyRole || verifyRole.role !== 'ISSUER')
        return res.status(404).json({ error: 'Issuer DID does not have permissions.' })

      const DIDAgent = await getDIDAgent()

      const { unit, amount } = getPeriod(valid_period)
      const expirationDate = add(new Date(), { [unit]: amount })

      const newVC_ID = uuidv4()
      const newVC = await DIDAgent.createVerifiableCredential({
        credential: {
          id: newVC_ID,
          issuer: { id: req.jwtPayload.did },
          issuanceDate: new Date().toISOString(),
          expirationDate: expirationDate.toISOString(),
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', credential_type],
          credentialSubject: {
            id: holderDID.did,
            ...credential_subject,
          },
        },
        proofFormat: 'jwt',
        save: true,
      })
      let hash = {}
      if (is_return_hash) {
        hash = {
          hash: (
            await DIDAgent.dataStoreORMGetVerifiableCredentials({
              where: [
                {
                  column: 'id',
                  value: [newVC_ID.toString()],
                  op: 'Equal',
                },
              ],
            })
          )[0].hash,
        }
      }

      return res.status(201).json({ message: 'VC emitido', data: newVC, ...hash })
    } catch (error) {
      console.error('error', error)
      return res.status(500).json({ error: 'Problemas al emitir la VC' })
    }
  }
}
