import { Request, Response } from 'express'
import getDIDAgent from '../../../services/did-agent.js'
import ObfuscateIdentifierResource from '../../../services/obfuscate-identifier.js'
import { DIDResolutionResult, IIdentifier, UniqueVerifiableCredential } from '@veramo/core'
import config from '../../../core/config/index.js'
import { MasterWalletRepository } from '../../../repositories/index.js'
import { add } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import getPeriod from '../../../utils/get_period.js'
import generateJWT from '../../../utils/generate_jwt.js'
import {
  CreateDIDRequest,
  IssueVerifiableCredentialRequest,
  ShareVerifiableCredentialRequest,
} from '../dto/requests.js'

export default class DIDWalletController {
  /**
   *
   * @param {CreateDIDRequest} req.body
   * @param res
   * @returns
   */
  static async create(req: Request, res: Response) {
    try {
      const { identifiers }: CreateDIDRequest = req.body

      const obfuscateIdentifierResource = new ObfuscateIdentifierResource({
        privateKey: config.CELO_PRIVATE_KEY,
        nodeUrl: config.CELO_NODE_URL,
      })

      const obfuscatedIdentifiers = []

      if (!identifiers) {
        return res.status(400).json({ error: 'Identificadores no proporcionados' })
      }

      for (let i = 0; i < identifiers.length; i++) {
        const identifier = identifiers[i]
        const auxObfuscatedIdentifier = await obfuscateIdentifierResource.getObfuscatedIdentifier(identifier)

        const validateIdentifier = await obfuscateIdentifierResource.lookupAttestations(
          undefined,
          auxObfuscatedIdentifier
        )
        if (validateIdentifier) {
          return res.status(400).json({ error: 'Identificador ya registrado' })
        }
        obfuscatedIdentifiers.push(auxObfuscatedIdentifier)
      }

      const DIDAgent = await getDIDAgent()

      const newDIDWallet: IIdentifier = await DIDAgent.didManagerCreate({
        provider: config.DID_PROVIDER,
        kms: config.VERAMO_KMS,
        options: {},
      })

      const resolveDID: DIDResolutionResult = await DIDAgent.resolveDid({ didUrl: newDIDWallet.did })

      let blockchainAccountId
      if (resolveDID?.didDocument?.verificationMethod && resolveDID?.didDocument?.verificationMethod?.length > 0) {
        blockchainAccountId = resolveDID?.didDocument?.verificationMethod.find(
          (method) => typeof method.blockchainAccountId == 'string'
        )?.blockchainAccountId
      }

      for (let i = 0; i < obfuscatedIdentifiers.length; i++) {
        await obfuscateIdentifierResource.registerAttestation(
          blockchainAccountId?.split(':')[2] as string,
          undefined,
          obfuscatedIdentifiers[i]
        )
      }

      MasterWalletRepository.create({
        id_wallet: blockchainAccountId?.split(':')[2],
        did: newDIDWallet.did,
      })

      return res
        .status(201)
        .json({ message: 'DID creado exitosamente', did: newDIDWallet.did, created_at: new Date().toISOString() })
    } catch (error) {
      return res.status(500).json({ error: 'Problemas al crear la DID' })
    }
  }

  /**
   * Issue a Verifiable Credential
   *
   * @param {Request} req
   * @param {IssueVerifiableCredentialRequest} req.body
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  static async issueVerifiableCredential(req: Request, res: Response) {
    try {
      const {
        identifier,
        credential_subject,
        credential_type,
        valid_period,
        is_return_hash,
      }: IssueVerifiableCredentialRequest = req.body

      const obfuscateIdentifierResource = new ObfuscateIdentifierResource({
        privateKey: config.CELO_PRIVATE_KEY,
        nodeUrl: config.CELO_NODE_URL,
      })

      const obfuscatedIdentifier = await obfuscateIdentifierResource.getObfuscatedIdentifier(identifier)

      const lookupIdentifier = await obfuscateIdentifierResource.lookupAttestations(undefined, obfuscatedIdentifier)
      if (!lookupIdentifier) {
        return res.status(400).json({ error: 'Identificador no registrado' })
      }

      const wallet = await MasterWalletRepository.findOne({ where: { id_wallet: lookupIdentifier } })

      const DIDAgent = await getDIDAgent()

      const { unit, amount } = getPeriod(valid_period)
      const expirationDate = add(new Date(), { [unit]: amount })

      const newVC_ID = uuidv4()
      const newVC = await DIDAgent.createVerifiableCredential({
        credential: {
          id: newVC_ID,
          issuer: { id: config.IDENTI_DID },
          issuanceDate: new Date().toISOString(),
          expirationDate: expirationDate.toISOString(),
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', credential_type],
          credentialSubject: {
            id: wallet.did,
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

  /**
   *  Share a Verifiable Credential
   *
   * Note: This function uses verifyVCToken middleware to get the DID from the token
   *
   * @param {Request} req
   * @param {ShareVerifiableCredentialRequest} req.body
   * @param {Response} res
   * @returns
   */
  static async shareVerifiableCredential(req: Request, res: Response) {
    try {
      const { verifiable_credential_id }: ShareVerifiableCredentialRequest = req.body

      if (!req.did) {
        return res.status(500).json({ error: 'Identificador no tiene una DID activa.' })
      }

      const DIDAgent = await getDIDAgent()

      let verifiableCredentials: UniqueVerifiableCredential[] = new Array()
      if (verifiable_credential_id) {
        verifiableCredentials = await DIDAgent.dataStoreORMGetVerifiableCredentials({
          where: [
            {
              column: 'subject',
              value: [req.did],
              op: 'Equal',
            },
            {
              column: 'id',
              value: [verifiable_credential_id],
              op: 'Equal',
            },
          ],
        })
      } else {
        verifiableCredentials = await DIDAgent.dataStoreORMGetVerifiableCredentials({
          where: [
            {
              column: 'subject',
              value: [req.did],
              op: 'Equal',
            },
            {
              column: 'type',
              value: ['VerifiableCredential,AuthVerifiableCredential'],
              not: true,
              op: 'Equal',
            },
          ],
        })
      }

      if (!verifiableCredentials || verifiableCredentials.length === 0) {
        return res.status(404).json({ error: 'No posee credenciales verificables para compartir' })
      }

      const ids = verifiableCredentials.map((vc) => vc.verifiableCredential.id)
      const payload = {
        service: 'ms-identi-agent',
        verifiable_credentials_id: ids,
      }

      const jwt = generateJWT(payload)
      const url = `${config.SHARE_VC_HOST}/verifiable_credentials?accessKey=${jwt}`

      return res.status(200).json({ message: 'Credenciales verificables compartidas', url })
    } catch (error) {
      console.error('error', error)
      return res.status(500).json({ error: 'Problemas al compartir la VC' })
    }
  }

  /**
   * List shared Verifiable Credentials
   *
   * Note: This function uses middlewareJWT middleware to get the verifiable_credentials_id from the token,
   * verifiable_credentials_id is an array of ids of the VCs that have been shared
   *
   * @param {Request} req
   * @param {Response} res
   * @returns
   */
  static async listSharedVerifiableCredential(req: Request, res: Response) {
    try {
      // @ts-ignore
      const verifiable_credentials_id = req.verifiable_credentials_id

      const DIDAgent = await getDIDAgent()

      const VCs: UniqueVerifiableCredential[] = await DIDAgent.dataStoreORMGetVerifiableCredentials({
        where: [
          {
            column: 'id',
            value: verifiable_credentials_id,
            op: 'In',
          },
        ],
      })

      return res.status(200).json({ message: 'VCs listados', data: VCs })
    } catch (error) {
      console.error('error', error)
      return res.status(500).json({ error: 'Problemas al listar las VC' })
    }
  }

  /**
   * Verify a Verifiable Credential
   *
   * @param {Request} req
   * @param {Response} res
   * @returns
   */
  static async verifyCredential(req: Request, res: Response) {
    try {
      const { credential } = req.body

      const DIDAgent = await getDIDAgent()

      const verifyVC = await DIDAgent.verifyCredential({
        credential,
        policies: {
          now: Math.floor(Date.now() / 1000),
          expirationDate: true,
        },
      })

      return res.status(200).json({ verified: verifyVC.verified })
    } catch (error) {
      return res.status(500).json({ error: 'Problemas al listar las VC' })
    }
  }

  /**
   * List names of Verifiable Credentials issued
   *
   * Note: This function uses verifyVCToken middleware to get the DID from the token
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<Response>}
   */
  static async listNamesVerifiableCredentials(req: Request, res: Response) {
    try {
      if (!req.did) {
        return res.status(500).json({ error: 'Identificador no tiene una DID activa.' })
      }

      const DIDAgent = await getDIDAgent()

      const VCs = await DIDAgent.dataStoreORMGetVerifiableCredentials({
        where: [
          {
            column: 'subject',
            value: [req.did],
            op: 'Equal',
          },
          {
            column: 'type',
            value: ['VerifiableCredential,AuthVerifiableCredential'],
            not: true,
            op: 'Equal',
          },
        ],
      })

      if (!VCs || VCs.length === 0) {
        return res.status(404).json({ error: 'No posee credenciales verificables para compartir' })
      }

      const verifiable_credentials = new Array<any>()

      VCs.forEach((vc) => {
        if (!vc.verifiableCredential?.type) return
        const type = vc.verifiableCredential?.type[1]
        if (type) {
          const formattedWord = type
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase()
            .replace(/ /g, ' ')

          verifiable_credentials.push({ id: vc.verifiableCredential.id, name: formattedWord })
        }
      })

      return res.status(200).json({ message: 'Credenciales verificables', verifiable_credentials })
    } catch (error) {
      console.error('error', error)
      return res.status(500).json({ error: 'Problemas al listar las credenciales verificables' })
    }
  }

  /**
   * Get DID
   *
   * Note: This function uses verifyVCToken middleware to get the DID from the token
   *
   * @param {Request} req
   * @param {Response} res
   * @returns
   */
  static async getDID(req: Request, res: Response) {
    try {
      if (!req.did) {
        return res.status(500).json({ error: 'Identificador no tiene una DID activa.' })
      }

      return res.status(200).json({ did: req.did })
    } catch (error) {
      console.error('error', error)
      return res.status(500).json({ error: 'Problemas al obtener la DID' })
    }
  }
}
