# Server Setup

This is what you need to do set up the bot on the server. These instructions assumes you have root access to a VPS with Ubuntu and are setting up the bot from a fresh installation.

## Every Developer Needs an SSH Key

Pushing to the server repository will require you to have an SSH key associated with the bot user. This is true for every developer as they will all access the same user account on the server, the one belonging to the bot. Their public keys must be added to the user account before they can make any changes.

## Setup Process

### Your Local Machine

Create an SSH keypair using `ssh-keygen -t rsa`, this is requied for accessing and pushing to the server. You can also add the following to your `~/.ssh/config`:

```
Host <server_IP>
  Hostname <server_IP>
  User bot
  IdentityFile <path_to_your_public_key.pub>
  IdentitiesOnly yes
```
With that, you'll be able to SSH using `ssh bot@<server_IP>`.

### As the Root User
1. `apt update && apt -y upgrade`
2. `apt install -y git build-essential python-minimal gyp`
3. `adduser bot --disabled-password`, create a new user account for the bot
4. `su bot`, switch to the bot user account

### As the Bot User
1. Create `~/.ssh/authorized_keys` and append all SSH public keys for developers who will be pushing to the server
2. Install node using [nvm](https://github.com/creationix/nvm)
3. `cd ~ && git init --bare repo` to create the server repository,
which will be separate from the source code directory. See more about using server-side githooks [here](https://www.digitalocean.com/community/tutorials/how-to-use-git-hooks-to-automate-development-and-deployment-tasks#using-git-hooks-to-deploy-to-a-separate-production-server).
4. Clone the repo in the user directory, `git clone <repo_url>`. Avoid renaming the directory as it will effect the rest of the setup process (code should be in `~/edmp-bot`).
5. Create a symlink for the post-receive hook using `ln -s ~/edmp-bot/hooks/post-receive ~/repo/hooks/post-receive`. Make sure the script is executable, if not use `chmod +x ~/edmp-bot/hooks/post-receive`.
6. Add the bot config file at `~/edmp-bot/config.js`. See `Required Configuration` in the README
7. `cd ~/edmp-bot && npm install`
8. Start the bot by running `./start &`

### Back on Your Local Machine

With the bot running, githooks set up, and SSH access granted you can add the server as a remote repository in your local copy of the source code using `git remote add production bot@<server_IP>:repo`. The URI can be read as `<user>@<host>:<git_directory>`, where the git directory points to the bare git repository on the server in the user's home directory, in this case `~/repo` or `/home/bot/repo`.

Now you, and others, can push changes to the server using `git push production master`.
