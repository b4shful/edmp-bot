# EDMP Bot

## Environment Setup

This repo includes two virtual environments created by `venv` and `nodeenv` to
include the Python and Node.js used in development. To use them run the
following in the project root directory:

```
source env/python/bin/activate && source env/node/bin/activate

# You'll see (node)(python)$ in your shell indicating you're in two virtual
# environments which include the version of node.js and python used for
# development.

# To exit the virtual environments run:
deactivate
```

You will now be able to install the Node.js dependencies used by the bot
by running `npm install` in the project root directory. Be sure to do this
before attempting to start the bot.

## Required Configuration

Copy `config.example.js` to `config.js` to provide most of the necessary
configuration used by the bot. You'll need to update the `prefix`,
`modLogChannel`, `ownerID`, and `token` values before running the bot.

The two big ones are the bot's `ownerId` and the bot's `token`. Discord
provides bot-users who are invited to a server for operation. The `token`
is what associates this bot to that user account.

## Running the Bot

In production use the `start` and `stop` scripts included in the project
root directory so the bot will remain running on the server without an
active user session. For development, run `npm start`.
