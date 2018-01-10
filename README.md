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

## Required Configuration

Before running the bot there are two configuration values required; the
bot's `ownerId` and the bot's `token`. Discord provides bot-users who
are invited to a server for operation. The `token` is what associates
this bot to that user account.

## Running the Bot

In production use the `start` and `stop` scripts included in the project
root directory so the bot will remain running on the server without an
active user session. For development, run `npm start`.
