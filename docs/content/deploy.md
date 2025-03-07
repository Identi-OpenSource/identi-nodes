# Deploy Identi Node using Docker

## Deploy using Docker

### Requirements

- Docker

### Commands

```bash
docker build -t {image_name} .
```

### Push image

Configure your docker registry account in Docker Hub or Github Container Registry.

- Using Docker Hub: [URL](https://docs.docker.com/docker-hub/quickstart/)
- Using Github Container Registry: [URL](https://docs.github.com/en/actions/use-cases-and-examples/publishing-packages/publishing-docker-images)

## Deploy using local machine

### Requirements

- Node 20.18.0
- Yarn

```bash

yarn install --production

yarn run start
```
