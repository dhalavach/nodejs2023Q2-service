# Home Library Service - Prisma, Postgres, and Docker (part 2)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js LTS version](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

## Downloading

```
git clone git@github.com:dhalavach/nodejs2023Q2-service.git
```

switch to prisma-docker branch:

```
git checkout prisma-docker
```

## Installing node modules

Node modules are necessary for running tests. To install, run:

```
npm install
```

in the unlikely event of error during the installation process, run:

```
npm install --force
```

### Environment variable

Please have .env file in the app folder with the environment variables as specified in the .env.example (or simply use the included .env file)

### Docker

download, install, and launch Docker

### Docker Hub

the images are available on Docker Hub. Please search for kopfmann/homelibservice-app and kopfmann/homelibservice-db . To test the app using Docker Hub images, pull the images and start the containers by running:

```
npm run docker:pull
```

then, open repo folder in terminal, install dependencies if you have not already and run

```
npm run test
```

### Vulnerabilities scan

After you have built the images with npm run docker:build
you can scan them for vulnerabiities and recommendations using Docker Scout. Run

```
npm run docker:scan
```

### Building images

To build images yourself,first stop the containers you have pulled and started (so that port 5000 is free). Then run:

```
npm run docker:build

```

After starting the app on port (5000 by default) you can open a separate terminal window and run the tests

## Testing

After installing the dependencies, pulling or building the images, and starting the containers, open new terminal and run:

```
npm run test
```

Occasionally, the app takes some time to start inside the docker container, please wait a little if you encounter "socket hang up" error during tests (you can check the container's log in docker desktop to make sure that the app has started)

### Live reload

The app inside the docker container reloads automatically after changes in your local src folder (try changing console.log statement inside track.service.ts)

### Linter

To check for warnings and errors run

```
npm run lint
```

NB: false positive eslint warning with nest are a known bug, no-unused-vars gives an unneccessary warning in nest constructors

### Errors

if you encounter errors, consider pruning the system and then pull or build images again

```
docker system prune -a --volumes
```

WARNING: this will delete your unused images/containers and networks! run the command above only if you know what you are doing

if you have any questions please contact me at halavach@protonmail.com or RS School Node.js Discord (@dhalavach). Cheers!
