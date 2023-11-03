# Developer Read Me

Welcome to the developer read me! This is where I record notes on the technologies I use and how they're used in the application.

## Docker & GitHub Actions

A Docker image built from Dockerfile-dev named markteetsdev/sudoku-dev includes a copy of package.json and package-lock.json from 10/24/23. Any future updates to package.json and/or package-lock.json will require the image to be built again to be reflected in the image.

The file .github/workflows/build-tests.yml defines a GitHub action such that every time a commit is pushed to GitHub, the file docker-compose-test.yml is spun up, which in turn uses the markteetsdev/sudoku-dev image to create a container. This container acts as a runtime environment which includes every package from the package.json. The docker-compose-test.yml executes the command "npm run test" in that container, which runs all of the jest tests in the github repository.

The results of these tests can be found in the GitHub actions tab on GitHub. This way, any failed tests can be tracked back to a specific commit and the problem can be found and fixed.

I also created a docker image from Dockerfile called markteetsdev/sudoku-prod which contains the webpack bundled frontend and runs the server within the container. The server serves the frontend at localhost 3000. This version of the code could be deployed, but isn't in use at the moment.