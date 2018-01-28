# Local Setup

This is for setting up a copy of the bot locally for your own testing using your own bot token and server.

## Environment
1. Install Python 2.7, the bot will not work with Python 3
2. The bot boilerplate had a dependency on `node-gyp` which requires `make`, `gcc`, and `gyp`. This dependency may give you issues depending on the state of your environment
3. Install Node.js, it's recommended to use [nvm](https://github.com/creationix/nvm)

## Cloning
1. Clone the project repository
2. In the project root directory run `npm install`, any issues that come up will likely be related to the `node-gyp` dependency and your environment setup.
3. Add the bot config file `config.js`. See `Required Configuration` in the README.
4. Start the bot using `npm start`
