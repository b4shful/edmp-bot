# EDMP Bot

[![Build Status](https://travis-ci.org/buosseph/edmp-bot.svg?branch=master)](https://travis-ci.org/buosseph/edmp-bot)

The EDMP Discord bot.

## Getting Started

For development you will need to set up your own Discord server and a bot user. Read [this](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) on how to register your personal bot as a Discord application, get a bot token, and invite the bot user to your own server. The token is what associates your locally running bot to that user account. You will also need to enable developer mode on your Discord client in order to [get your user ID](https://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-).

### Environment Dependencies

Before starting you must have a version of Node.js on your system. Install it using [nvm](https://github.com/creationix/nvm) to keep everything in your user home directory. Install the most recent version of node using `nvm install node`; the bot requires Node.js 8 or greater.

### Installation

```
git clone [repo_url]
cd edmp-bot
npm install
```

### Configuration

Copy `config.example.js` to `config.js` to provide most of the necessary configuration used by the bot. You'll need to update the `prefix`, `modLogChannel`, `ownerID`, and `token` values before running the bot. The bot token is provided by Discord and the `ownerId` is your Discord user ID.

### Usage

Run the bot using `npm start`. When the bot is running you'll be able to make changes to commands and reload them using the `reload` command. Other changes will require you to stop the bot and run `npm start` again.
