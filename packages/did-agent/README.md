# DID Agent

## Structure

This repository use the following Veramo plugins:

<div align="center">

```mermaid
graph TD;
    A[DID-Agent] --> B[KeyManager]
    A --> C[DataStore]
    A --> D[DIDManager]
    A --> E[DIDResolver]
    A --> F[CredentialIssuer]
    B --> G[KMS]
    B --> H[KeyStore]
    D --> I[DIDStore]
    G --> J[Local]
```

</div>

## Plugins

### Key manager

The KeyManager plugin is responsible for managing keys and signing operations. It uses a KeyStore to store keys and a KMS to sign operations.

### Data store

The DataStore plugin is responsible for storing data. It uses a DIDStore to store DIDs.

### DID manager

The DIDManager plugin is responsible for managing DIDs. It uses a DIDStore to store DIDs and a DIDResolver to resolve DIDs.

### DID resolver

The DIDResolver plugin is responsible for resolving DIDs.

### Credential issuer

The CredentialIssuer plugin is responsible for issuing credentials.
