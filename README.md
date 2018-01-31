# EDMP Bot

The EDMP Discord bot.

## Dependencies
To run the bot, the following node.js modules are required:

|Dependency    | Install Command                 |
|--------------| --------------------------------|
|discord.js    | `npm install --save discord.js` |
|Enmap         | `npm install enmap`             |
|Enmap-level   | `npm install enmap-level`       |
|PM2           | `npm install pm2 -g`            |
To install these dependencies, start a terminal in the folder in which the bot is located, and run the install command above.

## Required Configuration

Copy `config.example.js` to `config.js` to provide most of the necessary configuration used by the bot. You'll need to update the `prefix`, `modLogChannel`, `ownerID`, and `token` values before running the bot.

The two big ones are the bot's `ownerId` and the bot's `token`. Discord provides bot-users who are invited to a server for operation. The `token` is what associates this bot to that user account.

## Making Changes to the Bot in Production

The bot is run from a repository stored on the same server which applies changes to code using githooks. If you have SSH access to the
bot user account on the server you can add it the server repo using `git remote add production bot@<server_IP>:edmp-bot` and push changes to the server using `git push production master`. Only changes to the master branch will be applied, do not push branches to production as they will be ignored and waste bandwidth.

## Management in Production

If you SSH into the server you'll have access to the `start`, `stop`, `checkquick`, and `checklive` scripts. Currently, when the bot is stopped or told to restart there is process used to have it start again automatically. You will need to SSH into the server and run `~/edmp-bot/start &` to bring it back up. You can use the check scripts to see logging information.
