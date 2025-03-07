# User Guide

You can go to [http://localhost:3330/api-docs](http://localhost:3330/api-docs) to see the API Swagger documentation if the endpoint `/api-docs` is available and execute API requests.

## Create a DID

You need to create a DID for the issuer. You can do this by running the following command:

| Variable         | Description                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `AGENT_BASE_URL` | The URL of the agent                                                                                                            |
| `AGENT_API_KEY`  | The API key of the agent                                                                                                        |
| `DID_ALIAS`      | The alias of the DID                                                                                                            |
| `DID_KMS`        | The Key Management System (KMS)                                                                                                 |
| `DID_PROVIDER`   | The provider of the DID, It depends on the providers available in the agent, you can use `did:ethr:celo` or `did:ethr:lacchain` |

```bash
export AGENT_BASE_URL="http://localhost:3330"
export AGENT_API_KEY="secret"
export DID_ALIAS="did-identi"
export DID_KMS="local"
export DID_PROVIDER="did:ethr:celo"

docker exec -it identi-nodes-organization_node-1 /bin/bash -c "curl -X 'POST' \
  ' \"$AGENT_BASE_URL\"/agent/didManagerCreate' \
  -H 'accept: application/json; charset=utf-8' \
  -H 'Authorization: Bearer $AGENT_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
\"alias\": \"$DID_ALIAS\",
  \"provider\": \"$DID_PROVIDER\",
  \"kms\": \"$DID_KMS\"
}'"
```

Response:

```json
{
  "did": "did:ethr:celo:0x0344309....",
  "controllerKeyId": "04443090bb3a475f5daaf593f7bac6af5f....",
  "keys": [
    {
      "type": "Secp256k1",
      "kid": "...",
      "publicKeyHex": "...",
      "meta": {
        "algorithms": [
          "ES256K",
          "ES256K-R",
          "eth_signTransaction",
          "eth_signTypedData",
          "eth_signMessage",
          "eth_rawSign"
        ]
      },
      "kms": "local"
    }
  ],
  "services": [],
  "provider": "did:ethr:celo",
  "alias": "did-identi"
}
```

Save `did` and`controllerKeyId` in a safe place, you will need them.

## Issue a Verifiable Credential

You can issue a Verifiable Credential using the `/agent/createVerifiableCredential` endpoint.

```js
import { add } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

const issuanceDate = new Date().toISOString()
const expirationDate = add(issuanceDate, { days: 30 })
const issuerDID = 'did:ethr:celo:0x0344309....'
const holderDID = 'did:ethr:celo:0x0344309....'

const credential = {
  credential: {
    id: uuidv4(),
    issuer: {
      id: issuerDID,
    },
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'PersonalCredential'], // Change VerifiableCredential to the credential type you want to issue
    credentialSubject: {
      id: holderDID, // This id is a reserved field, you can use it to identify the holder DID
      // Add the fields you want to issue
      name: 'string',
      email: 'string',
    },
    issuanceDate: issuanceDate.toISOString(),
    expirationDate: expirationDate.toISOString(),
  },
  proofFormat: 'jwt',
  save: true,
}
```

Response:

```json
{
  "proof": {
    "type": "string"
  },
  "issuer": {
    "id": "string"
  },
  "credentialSubject": {
    "id": "string"
  },
  "type": ["string"],
  "@context": "string",
  "issuanceDate": "string",
  "expirationDate": "string",
  "id": "string"
}
```

## Configure DIDComm Messaging with Mediator

DIDComm Messaging is a secure, private communication methodology built on decentralized identifiers (DIDs). It has different implementations, one of them is the DIDComm Mediator, this is useful when two parties are not directly connected to each other for different reasons, such as no internet connection, etc.

**In this case Identi DID will be the mediator. Replace `mediatorDID` with the DID provided by Identi.**

### Add DID Comm service and Key

1. (Optional) For add DIDComm service in the DID maybe you have to transfer tokens to the wallet address of the DID, You can resolve the DID and get this address using the `POST /resolveDid` endpoint.

   > **_NOTE:_** Transfer tokens to the wallet address of the DID depends on the network configuration. LACChain does not require this step.

   ```json
   {
     "didUrl": "did:ethr:celo:0x..."
   }
   ```

   In the response look for the `blockchainAccountId` field, after `eip155:` this is the wallet address.

2. Add DIDComm service using `POST /didManagerAddService` endpoint. The `serviceEndpoint` should be a `Mediator DID from Identi`.

   ```json
   {
     "did": "did:ethr:celo:0x...",
     "service": {
       "id": "didcomm_service",
       "type": "DIDCommMessaging",
       "serviceEndpoint": "did:ethr:celo:0x..."
     },
     "options": {
       "ttl": 3153600000 // 100 years - You can change this value as needed
       // "ttl": 432000 // 5 days - You can change this value as needed
     }
   }
   ```

3. Add did manager key, You have to use two endpoints, one for create a key and another for add the key to the DID.

   3.1. Create a key using `POST /didManagerCreateKey` endpoint

   ```json
   {
     "type": "X25519",
     "kms": "local"
   }
   ```

   3.2. Add the key to the DID using `POST /didManagerAddKey` endpoint

   ```json
   {
     "did": "did:ethr:celo:0x...",
     "key": {}, // The response of the previous request
     "options": {
       "ttl": 3153600000 // 100 years - You can change this value as needed
       // "ttl": 432000 // 5 days - You can change this value as needed
     }
   }
   ```

### Connect your DID to the Identi Mediator DID

1. Configure script for execute ts file

   ```js
   const response = await fetch(`${AGENT_BASE_URL}/open-api.json`)
   const agent = createAgent({
     plugins: [
       new AgentRestClient({
         url: `${AGENT_BASE_URL}/agent`,
         headers: {
           Authorization: `Bearer ${AGENT_API_KEY}`,
         },
         enabledMethods: Object.keys(schema['x-methods']),
         schema,
       }),
     ],
   })
   const mediatorDID = 'did:ethr:celo:0x...'
   ```

2. Create mediator connection

   ```js
   const createMediatorConnection = async (recipientDID: any) => {
     try {
       // Create mediate request
       const mediateRequestMessage = createV3MediateRequestMessage(recipientDID, mediatorDID)

       const packedMessage = await agent.packDIDCommMessage({
         packing: 'authcrypt',
         message: mediateRequestMessage,
       })

       const sentMessage = await agent.sendDIDCommMessage({
         messageId: mediateRequestMessage.id,
         packedMessage,
         recipientDidUrl: mediatorDID,
       })

       // Update mediate request
       const update = createV3RecipientUpdateMessage(recipientDID, mediatorDID, [
         {
           recipient_did: recipientDID,
           action: UpdateAction.ADD,
         },
       ])

       const packedUpdate = await agent.packDIDCommMessage({
         packing: 'authcrypt',
         message: update,
       })
       const updateResponse = await agent.sendDIDCommMessage({
         packedMessage: packedUpdate,
         recipientDidUrl: mediatorDID,
         messageId: update.id,
       })

       const query = createV3RecipientQueryMessage(recipientDID, mediatorDID)

       const packedQuery = await agent.packDIDCommMessage({
         packing: 'authcrypt',
         message: query,
       })
       const queryResponse = await agent.sendDIDCommMessage({
         packedMessage: packedQuery,
         recipientDidUrl: mediatorDID,
         messageId: query.id,
       })

       console.log('queryResponse', queryResponse)
     } catch (err) {
       console.log(err)
     }
   }
   ```

3. Ensure mediation granted

   ```js
   const ensureMediationGranted = async (recipientDID: string) => {
     const request = createV3MediateRequestMessage(recipientDID, mediatorDID);
     const packedRequest = await agent.packDIDCommMessage({
       packing: 'authcrypt',
       message: request,
     });
     const mediationResponse = await agent.sendDIDCommMessage({
       packedMessage: packedRequest,
       recipientDidUrl: mediatorDID,
       messageId: request.id,
     });

   if (
       mediationResponse.returnMessage?.type !== CoordinateMediation.MEDIATE_GRANT
     ) {
       throw new Error('mediation not granted');
     }
     const update = createV3RecipientUpdateMessage(recipientDID, mediatorDID, [
       {
         recipient_did: recipientDID,
         action: UpdateAction.ADD,
       },
     ]);
     const packedUpdate = await agent.packDIDCommMessage({
       packing: 'authcrypt',
       message: update,
     });
     const updateResponse = await agent.sendDIDCommMessage({
       packedMessage: packedUpdate,
       recipientDidUrl: mediatorDID,
       messageId: update.id,
     });

   if (
       updateResponse.returnMessage?.type !==
         CoordinateMediation.RECIPIENT_UPDATE_RESPONSE ||
       (updateResponse.returnMessage?.data as any)?.updates[0].result !== 'success'
     ) {
       throw new Error('mediation update failed');
     }
   };
   ```

## Send message

SenderDID is your DID, SubjectDID is the DID of the recipient.

```js
import { v4 as uuidv4 } from 'uuid'

const sendMessage = async (senderDID: string, subjectDID: string, body: string) => {
  const messageId = uuidv4()

  const message: any = {
    type: 'https://didcomm.org/basicmessage/2.0/message',
    from: senderDID,
    to: [subjectDID],
    id: messageId,
    body: body,
  }

  const packedMessage = await agent.packDIDCommMessage({
    packing: 'authcrypt',
    message,
  })

  if (packedMessage) {
    await agent.sendDIDCommMessage({
      messageId: messageId,
      packedMessage,
      recipientDidUrl: subjectDID,
    })
  }
}
```

## Receive message

```js
const receiveMessages = async (did: string) => {
  const deliveryRequest = createV3DeliveryRequestMessage(did, mediatorDID)
  deliveryRequest.body = { limit: 100 } // You can change the limit

  const packedRequest = await agent.packDIDCommMessage({
    packing: 'authcrypt',
    message: deliveryRequest,
  })

  const deliveryResponse = await agent.sendDIDCommMessage({
    packedMessage: packedRequest,
    recipientDidUrl: mediatorDID,
    messageId: deliveryRequest.id,
  })

  const messages = []
  for (const attachment of deliveryResponse?.returnMessage?.attachments ?? []) {
    const msg = await agent.handleMessage({
      raw: JSON.stringify(attachment.data.json),
    })
    messages.push({ message_id: attachment.id, ...msg.data })
  }

  return messages
}
```

## Mark message as read

```js
const markMessageAsRead = async (did: any, messageIdList: string[]) => {
  const MESSAGES_RECEIVED_MESSAGE_TYPE = 'https://didcomm.org/messagepickup/3.0/messages-received'

  const messagesRequestMessage: IDIDCommMessage = {
    id: uuidv4(),
    type: MESSAGES_RECEIVED_MESSAGE_TYPE,
    to: [mediatorDID],
    from: did,
    return_route: 'all',
    body: {
      message_id_list: messageIdList,
    },
  }

  const packedMessage = await agent.packDIDCommMessage({
    packing: 'authcrypt',
    message: messagesRequestMessage,
  })

  await agent.sendDIDCommMessage({
    messageId: messagesRequestMessage.id,
    packedMessage,
    recipientDidUrl: mediatorDID,
  })
}
```
